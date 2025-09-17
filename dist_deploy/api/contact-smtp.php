<?php
// Contact endpoint using PHPMailer over SMTP for better deliverability.
// Requires Composer autoload (vendor/autoload.php) to be available on the server.

// Only accept POST
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Method Not Allowed']);
  exit;
}

// Locate Composer autoload
$autoloadPaths = [
  __DIR__ . '/../vendor/autoload.php',      // public_html/vendor
  __DIR__ . '/vendor/autoload.php',         // public_html/api/vendor
  __DIR__ . '/../../vendor/autoload.php',   // one level up
];
$autoload = null;
foreach ($autoloadPaths as $p) {
  if (is_file($p)) { $autoload = $p; break; }
}
if (!$autoload) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Composer autoload not found. Install PHPMailer via Composer in the web root (vendor/autoload.php).']);
  exit;
}
require $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Read JSON payload (fallback to form-encoded)
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) { $data = $_POST; }

// Honeypot
$company = isset($data['company']) ? trim((string)$data['company']) : '';
if ($company !== '') { http_response_code(204); exit; }

// Extract and validate
$name = isset($data['name']) ? trim((string)$data['name']) : '';
$fromEmail = isset($data['user_email']) && trim((string)$data['user_email']) !== ''
  ? trim((string)$data['user_email'])
  : (isset($data['email']) ? trim((string)$data['email']) : '');
$subject = isset($data['subject']) ? trim((string)$data['subject']) : '';
$message = isset($data['message']) ? trim((string)$data['message']) : '';

if ($name === '' || $fromEmail === '' || $subject === '' || $message === '') {
  http_response_code(400);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Invalid payload']);
  exit;
}

// SMTP config from env
$host = getenv('SMTP_HOST') ?: '';
$port = (int)(getenv('SMTP_PORT') ?: 587);
$secure = strtolower(getenv('SMTP_SECURE') ?: 'tls'); // "tls" | "ssl" | ""
$user = getenv('SMTP_USER') ?: '';
$pass = getenv('SMTP_PASS') ?: '';
$to   = getenv('CONTACT_TO') ?: $user;
$from = getenv('CONTACT_FROM') ?: $user;

if (!$host || !$user || !$pass || !$to || !$from) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'SMTP not configured (missing SMTP_* or CONTACT_*)']);
  exit;
}

// Build content
$bodyText = "Nom: {$name}\nEmail: {$fromEmail}\nSujet: {$subject}\n\n{$message}";
$bodyHtml = '<div>'
  . '<p><strong>Nom:</strong> ' . htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
  . '<p><strong>Email:</strong> ' . htmlspecialchars($fromEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
  . '<p><strong>Sujet:</strong> ' . htmlspecialchars($subject, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
  . '<hr>'
  . '<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">'
  . htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
  . '</pre></div>';

// Send via PHPMailer SMTP
$mail = new PHPMailer(true);
try {
  $mail->CharSet = 'UTF-8';
  $mail->isSMTP();
  $mail->Host = $host;
  $mail->Port = $port;
  if ($secure === 'ssl' || $secure === 'tls') { $mail->SMTPSecure = $secure; }
  $mail->SMTPAuth = true;
  $mail->Username = $user;
  $mail->Password = $pass;

  $mail->setFrom($from, 'Site Web');
  $mail->addAddress($to);
  $mail->addReplyTo($fromEmail, $name);

  $mail->Subject = '[Contact] ' . $subject;
  $mail->isHTML(true);
  $mail->Body = $bodyHtml;
  $mail->AltBody = $bodyText;

  $mail->send();
  http_response_code(204);
  exit;
} catch (Exception $e) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Mailer error', 'detail' => $mail->ErrorInfo]);
  exit;
}

