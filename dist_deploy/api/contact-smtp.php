<?php
// Contact endpoint using PHPMailer over SMTP for better deliverability.
// Requires Composer autoload (vendor/autoload.php) to be available on the server.

header('Content-Type: application/json; charset=UTF-8');

// Debug/trace helper (logs to api/mail-error.log)
$LOG_FILE = __DIR__ . '/mail-error.log';
$DEBUG = (isset($_GET['debug']) && $_GET['debug'] === '1') || strtolower((string)getenv('APP_ENV')) === 'dev';
function log_err($msg)
{
  global $LOG_FILE;
  @file_put_contents($LOG_FILE, '[' . date('c') . "] " . $msg . "\n", FILE_APPEND);
}

// Load .env file manually
function loadEnv($path)
{
  if (!file_exists($path)) {
    return false;
  }

  $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) {
      continue; // Skip comments
    }

    if (strpos($line, '=') !== false) {
      list($name, $value) = explode('=', $line, 2);
      $name = trim($name);
      $value = trim($value);

      if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
      }
    }
  }
  return true;
}

// Try to load .env from different locations
$envPaths = [
  __DIR__ . '/../.env',           // public_html/.env
  __DIR__ . '/.env',              // api/.env
  __DIR__ . '/../../.env',        // root/.env
];

foreach ($envPaths as $envPath) {
  if (loadEnv($envPath)) {
    log_err("Loaded .env from: $envPath");
    break;
  }
}

// Only accept POST
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
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
  if (is_file($p)) {
    $autoload = $p;
    break;
  }
}
if (!$autoload) {
  log_err('Autoload not found. Tried: ' . implode(', ', $autoloadPaths));
  http_response_code(500);
  echo json_encode(['error' => 'Composer autoload not found']);
  exit;
}
require $autoload;

// Ensure PHPMailer classes are available; fallback to manual includes if autoload is misconfigured
$phClass = '\\PHPMailer\\PHPMailer\\PHPMailer';
if (!class_exists($phClass)) {
  // Try manual load from Composer vendor dir
  $vendorDir = dirname($autoload);
  $candidates = [
    $vendorDir . '/phpmailer/phpmailer/src/PHPMailer.php',
    $vendorDir . '/phpmailer/phpmailer/src/SMTP.php',
    $vendorDir . '/phpmailer/phpmailer/src/Exception.php',
  ];
  foreach ($candidates as $file) {
    if (is_file($file)) {
      require_once $file;
    }
  }
}
if (!class_exists($phClass)) {
  log_err('PHPMailer classes not found after autoload and manual include. vendorDir=' . (isset($vendorDir) ? $vendorDir : '?'));
  http_response_code(500);
  echo json_encode(['error' => 'PHPMailer not available (autoload)']);
  exit;
}

// Read JSON payload (fallback to form-encoded)
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
  $data = $_POST;
}

// Honeypot
$company = isset($data['company']) ? trim((string)$data['company']) : '';
if ($company !== '') {
  http_response_code(204);
  exit;
}

// Extract and validate
$name = isset($data['name']) ? trim((string)$data['name']) : '';
$fromEmail = isset($data['user_email']) && trim((string)$data['user_email']) !== ''
  ? trim((string)$data['user_email'])
  : (isset($data['email']) ? trim((string)$data['email']) : '');
$subject = isset($data['subject']) ? trim((string)$data['subject']) : '';
$message = isset($data['message']) ? trim((string)$data['message']) : '';

if ($name === '' || $fromEmail === '' || $subject === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid payload']);
  exit;
}

// Email format validation (server-side)
if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email format']);
  log_err('Invalid email format: ' . $fromEmail);
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
  log_err('SMTP config missing: host=' . ($host ? 'set' : '') . ', user=' . ($user ? 'set' : '') . ', pass=' . ($pass ? 'set' : '') . ', to=' . ($to ? 'set' : '') . ', from=' . ($from ? 'set' : ''));
  http_response_code(500);
  echo json_encode(['error' => 'SMTP not configured']);
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
$mail = new \PHPMailer\PHPMailer\PHPMailer(true);
try {
  $mail->CharSet = 'UTF-8';
  $mail->isSMTP();
  $mail->Host = $host;
  $mail->Port = $port;
  if ($secure === 'ssl' || $secure === 'tls') {
    $mail->SMTPSecure = $secure;
  }
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

  if ($DEBUG) {
    // Verbose debug to log file
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function ($str) {
      log_err('[SMTP] ' . $str);
    };
  }

  $mail->send();
  
  // Envoyer un accusé de réception au visiteur
  try {
    $ackMail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $ackMail->CharSet = 'UTF-8';
    $ackMail->isSMTP();
    $ackMail->Host = $host;
    $ackMail->Port = $port;
    if ($secure === 'ssl' || $secure === 'tls') { $ackMail->SMTPSecure = $secure; }
    $ackMail->SMTPAuth = true;
    $ackMail->Username = $user;
    $ackMail->Password = $pass;

    $ackMail->setFrom($from, 'Jérôme Marlier - Développeur Web');
    $ackMail->addAddress($fromEmail, $name);

    $ackMail->Subject = 'Confirmation de réception - ' . $subject;
    $ackMail->isHTML(true);
    
    $ackBodyHtml = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">Merci pour votre message !</h2>
      <p>Bonjour ' . htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . ',</p>
      <p>J\'ai bien reçu votre message concernant : <strong>' . htmlspecialchars($subject, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</strong></p>
      <p>Je vous répondrai dans les plus brefs délais (généralement sous 24-48h).</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
      <h3>Récapitulatif de votre message :</h3>
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
        <p><strong>Sujet :</strong> ' . htmlspecialchars($subject, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>
        <p><strong>Message :</strong></p>
        <div style="background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #3B82F6;">
          ' . nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')) . '
        </div>
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px;">
        Cordialement,<br>
        <strong>Jérôme Marlier</strong><br>
        Développeur Web Freelance<br>
        <a href="https://jeromemarlier.com" style="color: #3B82F6;">jeromemarlier.com</a>
      </p>
    </div>';
    
    $ackBodyText = "Merci pour votre message !\n\nBonjour $name,\n\nJ'ai bien reçu votre message concernant : $subject\n\nJe vous répondrai dans les plus brefs délais (généralement sous 24-48h).\n\nRécapitulatif de votre message :\nSujet : $subject\nMessage :\n$message\n\nCordialement,\nJérôme Marlier\nDéveloppeur Web Freelance\njeromemarlier.com";
    
    $ackMail->Body = $ackBodyHtml;
    $ackMail->AltBody = $ackBodyText;

    if ($DEBUG) {
      $ackMail->SMTPDebug = 2;
      $ackMail->Debugoutput = function($str) { log_err('[ACK SMTP] ' . $str); };
    }

    $ackMail->send();
    log_err('Accusé de réception envoyé à: ' . $fromEmail);
  } catch (\Throwable $e) {
    log_err('Erreur accusé de réception: ' . $e->getMessage());
    // Ne pas faire échouer l'envoi principal si l'accusé échoue
  }
  
  http_response_code(204);
  exit;
} catch (\Throwable $e) {
  log_err('Mailer error: ' . $e->getMessage());
  if (isset($mail) && property_exists($mail, 'ErrorInfo') && $mail->ErrorInfo) {
    log_err('PHPMailer ErrorInfo: ' . $mail->ErrorInfo);
  }
  http_response_code(500);
  echo json_encode(['error' => 'Mailer error']);
  exit;
}
