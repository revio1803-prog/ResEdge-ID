function layout(title, content) {

return `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">
<title>${title}</title>

<style>

body{
font-family: Arial, Helvetica, sans-serif;
margin:0;
background:#f5f6fa;
}

header{
background:#1e3a8a;
color:white;
padding:15px 40px;
font-size:22px;
font-weight:bold;
}

nav{
background:#111827;
padding:10px 40px;
}

nav a{
color:white;
margin-right:20px;
text-decoration:none;
font-size:14px;
}

nav a:hover{
text-decoration:underline;
}

.container{
max-width:1100px;
margin:auto;
padding:30px;
}

.card{
background:white;
padding:25px;
border-radius:8px;
box-shadow:0 2px 6px rgba(0,0,0,0.1);
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th{
background:#2563eb;
color:white;
padding:10px;
text-align:left;
}

td{
padding:10px;
border-bottom:1px solid #ddd;
}

tr:hover{
background:#f1f5f9;
}

.btn{
display:inline-block;
background:#2563eb;
color:white;
padding:10px 18px;
border-radius:4px;
text-decoration:none;
margin-top:10px;
}

footer{
text-align:center;
padding:20px;
margin-top:40px;
background:#111827;
color:white;
font-size:14px;
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
