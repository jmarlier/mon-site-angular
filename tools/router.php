<?php
// Router for PHP built-in server to serve Angular SPA from dist and route /api/* to PHP endpoints.

$public = realpath(__DIR__ . '/../dist/mon-site-perso/browser');
// Mark environment as dev for local preview so contact.php logs instead of sending mail
putenv('APP_ENV=dev');
if ($public === false) {
  http_response_code(500);
  echo 'Build folder not found. Run `npm run build` first.';
  exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = $public . $uri;
$real = realpath($path);

// Prevent path traversal
if ($real && strncmp($real, $public, strlen($public)) !== 0) {
  http_response_code(403);
  echo 'Forbidden';
  exit;
}

// Serve API files under /api (e.g. /api/contact.php)
if (preg_match('#^/api/#', $uri)) {
  $apiFile = $public . $uri;
  if (is_file($apiFile)) {
    require $apiFile;
    return true;
  }
  http_response_code(404);
  echo 'API not found';
  return true;
}

// Serve existing static files (assets, images, css, js)
if ($real && is_file($real)) {
  return false; // Let built-in server serve the file
}

// Fallback to index.html for SPA routes
$_SERVER['SCRIPT_FILENAME'] = $public . '/index.html';
require $public . '/index.html';
return true;
