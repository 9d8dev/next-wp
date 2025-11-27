<?php
/**
 * Fallback template
 *
 * This should rarely be seen - the redirect in functions.php
 * should catch all frontend requests.
 */

$nextjs_url = getenv('NEXTJS_URL');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Headless WordPress</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 { color: #333; }
        p { color: #666; }
        a {
            color: #0070f3;
            text-decoration: none;
        }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Headless WordPress</h1>
        <p>This WordPress installation is configured for headless use.</p>
        <?php if ($nextjs_url): ?>
            <p><a href="<?php echo esc_url($nextjs_url); ?>">Visit the frontend</a></p>
        <?php endif; ?>
        <p><a href="<?php echo esc_url(admin_url()); ?>">WordPress Admin</a></p>
    </div>
</body>
</html>
