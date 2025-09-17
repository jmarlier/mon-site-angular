<?php
// Lightweight PHP endpoint for contact form submissions.
// Place under public/api/contact.php so it is deployed with the app.

// CORS (same-origin recommended). Uncomment to allow cross origin during tests.
// header('Access-Control-Allow-Origin: https://your-domain');
// header('Vary: Origin');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo json_encode(['error' => 'Method Not Allowed']);
  exit;
}

// Read JSON payload (Angular HttpClient default)
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
  // Fallback to form-encoded
  $data = $_POST;
}

// Honeypot: ignore if filled
$company = isset($data['company']) ? trim((string)$data['company']) : '';
if ($company !== '') {
  http_response_code(204);
  exit;
}

// Extract fields
$name = isset($data['name']) ? trim((string)$data['name']) : '';
$fromEmail = isset($data['user_email']) && trim((string)$data['user_email']) !== ''
  ? trim((string)$data['user_email'])
  : (isset($data['email']) ? trim((string)$data['email']) : '');
$subject = isset($data['subject']) ? trim((string)$data['subject']) : '';
$message = isset($data['message']) ? trim((string)$data['message']) : '';

// Basic validation
if ($name === '' || $fromEmail === '' || $subject === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid payload']);
  exit;
}

// Protect against header injection
if (preg_match('/[\r\n]/', $fromEmail)) $fromEmail = '';

// Detect local preview (PHP built-in server)
$isDev = (getenv('APP_ENV') === 'dev') || (PHP_SAPI === 'cli-server');

// Config via env or defaults
$to = getenv('CONTACT_TO');
$from = getenv('CONTACT_FROM');
if (!$to) { $to = $from ?: ini_get('sendmail_from'); }
if (!$from) { $from = $to; }
// In dev preview, fallback to dummy addresses if not set and log instead of sending
if ($isDev && (!$to || !$from)) {
  $to = $to ?: 'dev-recipient@example.test';
  $from = $from ?: 'no-reply@example.test';
}

$site = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'website';
$subj = 'Contact — ' . $subject;

$bodyText = "Nom: {$name}\nEmail: {$fromEmail}\nSujet: {$subject}\n\n{$message}";
$bodyHtml = '<div>'
  . '<p><strong>Nom:</strong> ' . htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
  . '<p><strong>Email:</strong> ' . htmlspecialchars($fromEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
  . '<p><strong>Sujet:</strong> ' . htmlspecialchars($subject, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
  . '<hr>'
  . '<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">'
  . htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
  . '</pre></div>';

$boundary = '=_part_' . md5(uniqid('', true));
$headers = [];
$headers[] = 'From: ' . $from;
$headers[] = 'Reply-To: ' . $fromEmail;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

$body = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n" . $bodyText . "\r\n";
$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n" . $bodyHtml . "\r\n";
$body .= "--{$boundary}--\r\n";

if ($isDev) {
  // Write a local log file to simulate delivery in preview mode
  $logFile = __DIR__ . '/mail.log';
  @file_put_contents($logFile, date('c') . "\nTO: {$to}\nFROM: {$from}\nSUBJECT: {$subj}\n\n{$bodyText}\n\n---\n", FILE_APPEND);
  http_response_code(204);
  exit;
}

if (!$to || !$from) {
  http_response_code(500);
  echo json_encode(['error' => 'Mail not configured']);
  exit;
}

$ok = @mail($to, $subj, $body, implode("\r\n", $headers));
if ($ok) {
  http_response_code(204);
  exit;
}

http_response_code(500);
echo json_encode(['error' => 'Mail send failed']);
exit;
