<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>FoodPoint Admin — Login</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        .login-wrapper {
            width: 100%;
            max-width: 420px;
        }
        .login-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 2.5rem 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .logo-area {
            text-align: center;
            margin-bottom: 2rem;
        }
        .logo-icon {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            background: linear-gradient(135deg, #1a8a4a, #16a34a);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.75rem;
        }
        .logo-icon svg { width: 28px; height: 28px; fill: white; }
        .logo-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.025em; }
        .logo-subtitle { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            background: #fef3c7;
            color: #92400e;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            margin-top: 0.75rem;
        }
        .badge svg { width: 12px; height: 12px; fill: currentColor; }
        .form-group { margin-bottom: 1.25rem; }
        .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 0.5rem;
        }
        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 0.9375rem;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            transition: all 0.2s;
            outline: none;
            font-family: inherit;
        }
        .form-input:focus {
            border-color: #1a8a4a;
            box-shadow: 0 0 0 3px rgba(26, 138, 74, 0.1);
        }
        .form-input.is-invalid {
            border-color: #dc2626;
        }
        .error-msg {
            color: #dc2626;
            font-size: 0.8125rem;
            margin-top: 0.375rem;
        }
        .alert {
            padding: 0.75rem 1rem;
            border-radius: 10px;
            font-size: 0.875rem;
            margin-bottom: 1.25rem;
        }
        .alert-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
        }
        .btn-login {
            width: 100%;
            padding: 0.875rem;
            font-size: 0.9375rem;
            font-weight: 700;
            color: white;
            background: linear-gradient(135deg, #1a8a4a, #16a34a);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-login:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px -5px rgba(26, 138, 74, 0.4);
        }
        .btn-login:active { transform: translateY(0); }
        .btn-login svg { width: 18px; height: 18px; fill: white; }
        .remember-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .remember-row input { width: 16px; height: 16px; accent-color: #1a8a4a; cursor: pointer; }
        .remember-row label { font-size: 0.875rem; color: #64748b; cursor: pointer; user-select: none; }
        .footer-text {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.8125rem;
            color: #94a3b8;
        }
        .footer-text a { color: #1a8a4a; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="login-wrapper">
        <div class="login-card">
            <div class="logo-area">
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                    </svg>
                </div>
                <div class="logo-title">FoodPoint</div>
                <div class="logo-subtitle">Super Admin Panel</div>
                <div class="badge">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    Restricted Access
                </div>
            </div>

            @if ($errors->any())
                <div class="alert alert-error">
                    @foreach ($errors->all() as $error)
                        <div>{{ $error }}</div>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="{{ route('admin.login.post') }}">
                @csrf
                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        class="form-input {{ $errors->has('email') ? 'is-invalid' : '' }}"
                        placeholder="admin@foodpoint.co.tz"
                        required
                        autofocus
                        autocomplete="email"
                    >
                    @error('email')
                        <div class="error-msg">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        class="form-input {{ $errors->has('password') ? 'is-invalid' : '' }}"
                        placeholder="Enter your password"
                        required
                        autocomplete="current-password"
                    >
                    @error('password')
                        <div class="error-msg">{{ $message }}</div>
                    @enderror
                </div>

                <div class="remember-row">
                    <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                    <label for="remember">Remember me</label>
                </div>

                <button type="submit" class="btn-login">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
                    Sign In to Admin Panel
                </button>
            </form>

            <div class="footer-text">
                FoodPoint Restaurant Management Platform<br>
                &copy; {{ date('Y') }} — Authorized Personnel Only
            </div>
        </div>
    </div>
</body>
</html>
