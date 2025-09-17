<?php
header('Content-Type: application/json; charset=UTF-8');

$base = __DIR__;
$candidates = [
  $base . '/../vendor/autoload.php',
  $base . '/vendor/autoload.php',
  $base . '/../../vendor/autoload.php',
];
$autoloadFound = null;
foreach ($candidates as $p) {
  if (is_file($p)) { $autoloadFound = $p; break; }
}

$env = [
  'SMTP_HOST' => getenv('SMTP_HOST') ?: '',
  'SMTP_PORT' => getenv('SMTP_PORT') ?: '',
  'SMTP_SECURE' => getenv('SMTP_SECURE') ?: '',
  'SMTP_USER' => getenv('SMTP_USER') ?: '',
  // Do not expose SMTP_PASS
  'CONTACT_FROM' => getenv('CONTACT_FROM') ?: '',
  'CONTACT_TO' => getenv('CONTACT_TO') ?: '',
];

// Try to resolve SMTP host and connect (without sending)
$smtpReachable = null;
$smtpError = null;
$host = $env['SMTP_HOST'];
$port = (int)($env['SMTP_PORT'] ?: 587);
if ($host) {
  $timeout = 5; // seconds
  set_error_handler(function($errno, $errstr){ throw new Exception($errstr); });
  try {
    $ip = gethostbyname($host);
    $sock = @fsockopen($host, $port, $errno, $errstr, $timeout);
    if ($sock) {
      $smtpReachable = true;
      fclose($sock);
    } else {
      $smtpReachable = false;
      $smtpError = $errstr ?: 'connect failed';
    }
  } catch (Exception $e) {
    $smtpReachable = false;
    $smtpError = $e->getMessage();
  }
  restore_error_handler();
}

echo json_encode([
  'autoloadFound' => $autoloadFound,
  'env' => [
    'SMTP_HOST' => $env['SMTP_HOST'],
    'SMTP_PORT' => $env['SMTP_PORT'],
    'SMTP_SECURE' => $env['SMTP_SECURE'],
    'SMTP_USER' => $env['SMTP_USER'] ? '[set]' : '',
    'CONTACT_FROM' => $env['CONTACT_FROM'],
    'CONTACT_TO' => $env['CONTACT_TO'],
  ],
  'smtpReachable' => $smtpReachable,
  'smtpError' => $smtpError,
]);
exit;

