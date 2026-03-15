function layout(title, content) {

return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${title}</title>

<style>

/* =========================
GLOBAL
========================= */

body{
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial;
margin:0;
background:#f4f6fb;
color:#1f2937;
}

/* =========================
HEADER
========================= */

header{
background:#1e3a8a;
color:white;
padding:18px 40px;
font-size:22px;
font-weight:600;
letter-spacing:0.5px;
}

/* =========================
NAVBAR
========================= */

nav{
background:#111827;
padding:12px 40px;
display:flex;
flex-wrap:wrap;
gap:18px;
}

nav a{
color:white;
text-decoration:none;
font-size:14px;
opacity:0.9;
}

nav a:hover{
opacity:1;
text-decoration:underline;
}

/* =========================
PAGE CONTAINER
========================= */

.container{
max-width:1100px;
margin:auto;
padding:30px 20px;
}

/* =========================
CARD
========================= */

.card{
background:white;
padding:30px;
border-radius:10px;
box-shadow:0 3px 12px rgba(0,0,0,0.08);
}

/* =========================
TABLE
========================= */

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th{
background:#2563eb;
color:white;
padding:12px;
font-size:14px;
text-align:left;
}

td{
padding:12px;
border-bottom:1px solid #e5e7eb;
font-size:14px;
}

tr:hover{
background:#f9fafb;
}

/* =========================
BUTTONS
========================= */

.btn{
display:inline-block;
background:#2563eb;
color:white;
padding:10px 18px;
border-radius:6px;
text-decoration:none;
font-size:14px;
margin-right:10px;
margin-top:10px;
}

.btn:hover{
background:#1d4ed8;
}

/* =========================
FORM
========================= */

input, select{
width:100%;
padding:10px;
border:1px solid #d1d5db;
border-radius:6px;
margin-top:6px;
margin-bottom:15px;
font-size:14px;
}

label{
font-size:14px;
font-weight:500;
}

/* =========================
FOOTER
========================= */

footer{
text-align:center;
padding:25px;
margin-top:40px;
background:#111827;
color:white;
font-size:14px;
}

/* =========================
MOBILE
========================= */

@media (max-width:700px){

header{
padding:16px;
font-size:18px;
}

nav{
padding:10px 16px;
}

.container{
padding:20px;
}

}

</style>

</head>

<body>

<header>
Research Edge Identifier Registry
</header>

<nav>

<a href="/">Home</a>

<a href="/browse-authors">Authors</a>

<a href="/browse-datasets">Datasets</a>

<a href="/create-author">Create Author</a>

<a href="/create-dataset">Create Dataset</a>

</nav>

<div class="container">

<div class="card">

${content}

</div>

</div>

<footer>

© Research Edge & Publication Pvt Ltd

</footer>

</body>

</html>
`

}

module.exports = layout
