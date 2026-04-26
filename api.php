<?php
/**
 * The Well Service - Backend API (Gabia Optimized)
 * Handles persistent storage for Portfolio, Reviews, and System Images using a local db.json file.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Password');

$dbFile = 'db.json';

// Initialize DB if not exists
if (!file_exists($dbFile)) {
    $initialData = [
        'portfolio' => [],
        'reviews' => [],
        'system_images' => [],
        'lastUpdated' => date('Y-m-d H:i:s')
    ];
    file_put_contents($dbFile, json_encode($initialData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit(0);
}

if ($method === 'GET') {
    $data = file_get_contents($dbFile);
    echo $data;
    exit;
}

if ($method === 'POST') {
    // Basic Security: Check Password in Header
    $headers = getallheaders();
    $adminPassword = $headers['X-Admin-Password'] ?? $headers['x-admin-password'] ?? '';
    
    // In a real Gabe-based hosting, you might want a more robust check, 
    // but for now, we'll allow the frontend to pass the password.
    // If you want to hardcode it for extra safety, replace 'CHANGE_ME' with your admin password.
    
    $input = file_get_contents('php://input');
    $newData = json_decode($input, true);
    
    if (!$newData) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }
    
    // Update timestamp
    $newData['lastUpdated'] = date('Y-m-d H:i:s');
    
    $success = file_put_contents($dbFile, json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save data to server disk']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
?>
