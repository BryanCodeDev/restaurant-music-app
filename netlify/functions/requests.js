// netlify/functions/requests.js
import mysql from 'mysql2/promise';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restaurant_music_db',
  connectionLimit: 10,
};

let connection;

const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const db = await getConnection();
    const { httpMethod, path, queryStringParameters } = event;

    switch (httpMethod) {
      case 'GET':
        return await getRequests(db, queryStringParameters);
      
      case 'POST':
        const newRequest = JSON.parse(event.body);
        return await createRequest(db, newRequest);
      
      case 'PUT':
        const requestId = path.split('/').pop();
        const updateData = JSON.parse(event.body);
        
        if (path.includes('/move-top')) {
          return await moveRequestToTop(db, requestId);
        }
        return await updateRequest(db, requestId, updateData);
      
      case 'DELETE':
        const deleteId = path.split('/').pop();
        return await cancelRequest(db, deleteId);
      
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

// GET - Obtener peticiones
const getRequests = async (db, params) => {
  const { 
    restaurant_id = 'rest-001', 
    user_id, 
    status, 
    limit = 50, 
    offset = 0 
  } = params || {};
  
  let query = `
    SELECT 
      r.id, r.restaurant_id, r.user_id, r.song_id, r.status, r.queue_position,
      r.user_table, r.requested_at, r.started_playing_at, r.completed_at,
      s.title, s.artist, s.album, s.duration, s.image, s.genre,
      u.table_number, u.name as user_name
    FROM requests r
    JOIN songs s ON r.song_id = s.id
    JOIN users u ON r.user_id = u.id
    WHERE r.restaurant_id = ?
  `;
  let queryParams = [restaurant_id];

  // Filtros
  if (user_id) {
    query += ' AND r.user_id = ?';
    queryParams.push(user_id);
  }

  if (status) {
    query += ' AND r.status = ?';
    queryParams.push(status);
  }

  // Ordenar por estado y posición en cola
  query += ` 
    ORDER BY 
      CASE r.status 
        WHEN 'playing' THEN 1 
        WHEN 'pending' THEN 2 
        WHEN 'completed' THEN 3 
        WHEN 'cancelled' THEN 4 
      END,
      r.queue_position ASC,
      r.requested_at ASC
  `;
  
  query += ' LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const [rows] = await db.execute(query, queryParams);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      requests: rows,
      total: rows.length,
    }),
  };
};

// POST - Crear nueva petición
const createRequest = async (db, requestData) => {
  const { restaurant_id, user_id, song_id, user_table } = requestData;

  // Verificar límites
  const [userRequestsCount] = await db.execute(
    'SELECT COUNT(*) as count FROM requests WHERE user_id = ? AND status = "pending"',
    [user_id]
  );

  const maxRequests = 2; // Configurable
  if (userRequestsCount[0].count >= maxRequests) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: `Máximo ${maxRequests} peticiones pendientes por mesa`,
        code: 'MAX_REQUESTS_EXCEEDED'
      }),
    };
  }

  // Obtener siguiente posición en cola
  const [queuePosition] = await db.execute(
    'SELECT COALESCE(MAX(queue_position), 0) + 1 as next_position FROM requests WHERE restaurant_id = ? AND status = "pending"',
    [restaurant_id]
  );

  const nextPosition = queuePosition[0].next_position;

  // Crear la petición
  const query = `
    INSERT INTO requests (restaurant_id, user_id, song_id, user_table, queue_position, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  const [result] = await db.execute(query, [
    restaurant_id, user_id, song_id, user_table, nextPosition
  ]);

  // Actualizar contador de peticiones de la canción
  await db.execute(
    'UPDATE songs SET times_requested = times_requested + 1, last_requested_at = NOW() WHERE id = ?',
    [song_id]
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      success: true,
      requestId: result.insertId,
      queuePosition: nextPosition,
      message: 'Petición creada exitosamente'
    }),
  };
};

// PUT - Actualizar petición
const updateRequest = async (db, requestId, updateData) => {
  const { status } = updateData;
  
  let query = 'UPDATE requests SET ';
  let values = [];
  let updates = [];

  if (status) {
    updates.push('status = ?');
    values.push(status);

    // Agregar timestamps según el estado
    if (status === 'playing') {
      updates.push('started_playing_at = NOW()');
    } else if (status === 'completed') {
      updates.push('completed_at = NOW()');
    }
  }

  if (updates.length === 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No valid fields to update' }),
    };
  }

  query += updates.join(', ') + ' WHERE id = ?';
  values.push(requestId);

  const [result] = await db.execute(query, values);

  // Si se marca como playing, pausar otras canciones playing
  if (status === 'playing') {
    await db.execute(
      'UPDATE requests SET status = "completed", completed_at = NOW() WHERE status = "playing" AND id != ?',
      [requestId]
    );
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      affectedRows: result.affectedRows,
      message: 'Petición actualizada exitosamente'
    }),
  };
};

// PUT - Mover petición al inicio de la cola
const moveRequestToTop = async (db, requestId) => {
  // Actualizar posiciones: incrementar todas las posiciones pendientes
  await db.execute(
    `UPDATE requests 
     SET queue_position = queue_position + 1 
     WHERE status = 'pending' AND restaurant_id = (
       SELECT restaurant_id FROM (SELECT restaurant_id FROM requests WHERE id = ?) as temp
     )`,
    [requestId]
  );

  // Establecer la petición seleccionada en posición 1
  const [result] = await db.execute(
    'UPDATE requests SET queue_position = 1 WHERE id = ?',
    [requestId]
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      affectedRows: result.affectedRows,
      message: 'Petición movida al inicio de la cola'
    }),
  };
};

// DELETE - Cancelar petición
const cancelRequest = async (db, requestId) => {
  // Actualizar el estado a cancelado
  const [result] = await db.execute(
    'UPDATE requests SET status = "cancelled", completed_at = NOW() WHERE id = ?',
    [requestId]
  );

  // Reorganizar la cola
  await reorganizeQueue(db, requestId);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      affectedRows: result.affectedRows,
      message: 'Petición cancelada exitosamente'
    }),
  };
};

// Función helper para reorganizar la cola
const reorganizeQueue = async (db, removedRequestId) => {
  // Obtener el restaurant_id y queue_position de la petición eliminada
  const [requestInfo] = await db.execute(
    'SELECT restaurant_id, queue_position FROM requests WHERE id = ?',
    [removedRequestId]
  );

  if (requestInfo.length === 0) return;

  const { restaurant_id, queue_position } = requestInfo[0];

  // Decrementar la posición de todas las peticiones posteriores
  await db.execute(
    `UPDATE requests 
     SET queue_position = queue_position - 1 
     WHERE restaurant_id = ? AND status = 'pending' AND queue_position > ?`,
    [restaurant_id, queue_position]
  );
};

// Función helper para obtener estadísticas de cola
export const getQueueStats = async (db, restaurantId) => {
  const [stats] = await db.execute(`
    SELECT 
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
      COUNT(CASE WHEN status = 'playing' THEN 1 END) as playing_count,
      COUNT(CASE WHEN status = 'completed' AND DATE(completed_at) = CURDATE() THEN 1 END) as completed_today,
      AVG(CASE WHEN status = 'completed' AND started_playing_at IS NOT NULL 
          THEN TIMESTAMPDIFF(MINUTE, requested_at, started_playing_at) END) as avg_wait_time
    FROM requests 
    WHERE restaurant_id = ?
  `, [restaurantId]);

  return stats[0] || {};
};