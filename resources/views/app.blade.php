<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <title>Bufallus</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="dist/styles.css"/>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>

<body>
<app-root>

    <style>

        .loading {
            display: block;
            position: relative;
            width: 100px;
            height: 80px;
        }

        .topbun, .tomato, .lettuce-cheese, .meat, .bottombun {
            display: block;
            width: 100px;
            position: absolute;
            opacity: 0;
        }

        .topbun {
            height: 35px;
            bottom: 42px;
            background: url("/dist/assets/icons/loading-topbun.png") center no-repeat;
            animation-delay: 1.2s;
        }

        .tomato {
            height: 6px;
            bottom: 36px;
            background: url("/dist/assets/icons/loading-tomato.png") center no-repeat;
            animation-delay: 0.9s;
        }

        .lettuce-cheese {
            height: 10px;
            bottom: 26px;
            background: url("/dist/assets/icons/loading-lettuce_cheese.png") center no-repeat;
            animation-delay: 0.6s;
        }

        .meat {
            height: 11px;
            bottom: 15px;
            background: url("/dist/assets/icons/loading-meat.png") center no-repeat;
            animation-delay: 0.3s;
        }

        .bottombun {
            height: 15px;
            bottom: 0px;
            background: url("/dist/assets/icons/loading-bottombun.png") center no-repeat;
        }

        .animated {
            animation-fill-mode: both;
            animation-duration: 3.1s;
        }

        @keyframes fadeInDown {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        .fadeInDown {
            animation-name: fadeInDown;
            animation-direction: reverse;
            animation-iteration-count: infinite;
        }

        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
    </style>
    <div class="container">
        <div style="display: flex; flex-direction: column;">
            <div class="animated loading">
                <div class="topbun animated fadeInDown"></div>
                <div class="tomato animated fadeInDown"></div>
                <div class="lettuce-cheese animated fadeInDown"></div>
                <div class="meat animated fadeInDown"></div>
                <div class="bottombun animated fadeInDown"></div>
            </div>
            <span style="margin-bottom: 85px;">Carregando...</span>
        </div>
    </div>
</app-root>

<script type="text/javascript" src="dist/runtime.js"></script>
<script type="text/javascript" src="dist/polyfills.js"></script>
<script type="text/javascript" src="dist/scripts.js"></script>
<script type="text/javascript" src="dist/vendor.js"></script>
<script type="text/javascript" src="dist/main.js"></script>
</body>
</html>
