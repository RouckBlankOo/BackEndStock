exports.createHealthPage = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Inventory System</title>
        <style>
       @import url('https://fonts.googleapis.com/css?family=Raleway:300');
                html, body {
                	height: 100%;
	                width: 100%;
	                background: #47515e;
	                font-family: 'Raleway', sans-serif;
                }
                main {
                	position: relative;
                	top: 0;
                	left: 0;
                }
                main h1 {
	                font-weight: lighter;
	                text-align: center;
	                margin-top: 50px;
	                color: #eee;
	                position: fixed;
                	width: 300px;
	                height: 100px;
                	top: 50%;
                	left: 50%;
                	margin-left: -150px;
                	margin-top: -170px;
                    font-size: 30px;
                }
                background: #13FC13;
                main span {
                    height: 10px;
                    width: 10px;
                    display: inline-block;
                    border-radius: 100%;
                    vertical-align: middle;
                }
                section {
                	position: fixed;
                	width: 250px;
                	height: 250px;
                	top: 50%;
                	left: 50%;
                	margin-left: -125px;
                	margin-top: -125px;
                }
section aside {
	background: #202730;
	height: 200px;
	width: 15px;
	position: absolute;
	z-index: -1;
}
section aside:nth-child(1) {
	left: 5px;
	top: 20px;
}
section aside:nth-child(2) {
	right: 5px;
	top: 20px;
}
section article {
	width: 100%;
	height: 50px;
	background: #202730;
	margin: 10px auto;
	position: relative;
	box-shadow: 10px 0px 15px #2D3540, -10px 0px 15px #2D3540;
}
section article span {
	width: 7px;
	height: 7px;
	border-radius: 100%;
	display: block;
	position: relative;
	top: 10px;
	left: 10px;
	margin: 0 0 15px 0;
}
section article span:nth-child(1) {
	background: #28cb40;
  animation: blinker 0.7s linear infinite;
}
section article span:nth-child(2) {
	background: #c99a31;
  animation: blinker 1.3s linear infinite;
}
section article span:nth-child(3) {
	background: transparent;
	border: 1px solid #fff;
	position: absolute;
	top: 20px;
	right: 10px;
	left: inherit;
}
section article ul li {
	width: 10px;
  height: 30px;
  background: #818993;
  position: absolute;
  display: inline-block;
  z-index: 1;
  top: 10px;
}
section article ul li:nth-child(1) {
  left: 30px;
  animation: fade 2s infinite alternate backwards;
}
section article ul li:nth-child(2) {
  left: 50px;
  animation: fade 1.8s 0.2s infinite alternate backwards;
}
section article ul li:nth-child(3) {
  left: 70px;
  animation: fade 1.6s 0.4s infinite alternate backwards;
}
section article ul li:nth-child(4) {
  left: 90px;
  animation: fade 1.4s 0.6s infinite alternate backwards;
}
section article ul li:nth-child(5) {
  left: 110px;
  animation: fade 1.2s 0.8s infinite alternate backwards;
}
section article ul li:nth-child(6) {
  left: 130px;
  animation: fade 1s 1s infinite alternate backwards;
}
section article ul li:nth-child(7) {
  left: 150px;
  animation: fade 0.8s 1.2s infinite alternate backwards;
}
section article ul li:nth-child(8) {
  left: 170px;
  animation: fade 0.6s 1.4s infinite alternate backwards;
}
section article ul li:nth-child(9) {
	width: 30px;
	background: #32a3ef;
	color: #202730;
	font-family: monospace;
  left: 190px;
  line-height: 27px;
  text-align: center;
  animation: pulse 1.5s linear infinite;
}

@keyframes blinker {
  50% { opacity: 0; }
}
@keyframes pulse {
  from { background-color: #32a3ef; box-shadow: 0 0 9px #333; }
  50% { background-color: #59B6F2; box-shadow: 0 0 15px #047AC7; }
  to { background-color: #32a3ef; box-shadow: 0 0 9px #333; }
}
@keyframes fade {
  from { filter: alpha(opacity=0); opacity: 0; }
  to { filter: alpha(opacity=100); opacity: 1; }
}
@-webkit-keyframes blinker {
  50% { opacity: 0; }
}
@-webkit-keyframes pulse {
  from { background-color: #32a3ef; box-shadow: 0 0 9px #333; }
  50% { background-color: #59B6F2; box-shadow: 0 0 15px #047AC7; }
  to { background-color: #32a3ef; box-shadow: 0 0 9px #333; }
}
@-webkit-keyframes fade {
  from { filter: alpha(opacity=0); opacity: 0; }
  to { filter: alpha(opacity=100); opacity: 1; }
}
        </style>
      </head>
      <body>
       <main>

	<h1>servers running <span></span></h1>

	<section>
		<!-- Vertical Line -->
		<aside></aside>
		<aside></aside>

		<!-- 1 -->
		<article>
			<span></span>
			<span></span>
			<span></span>

			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>

				<li>0A</li>
			</ul>
		</article>
		<!-- 2 -->
		<article>
			<span></span>
			<span></span>
			<span></span>

			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>

				<li>0B</li>
			</ul>
		</article>
		<!-- 3 -->
		<article>
			<span></span>
			<span></span>
			<span></span>

			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>

				<li>0C</li>
			</ul>
		</article>
		<!-- 4 -->
		<article>
			<span></span>
			<span></span>
			<span></span>

			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>

				<li>0D</li>
			</ul>
		</article>
	</section>
</main>
      </body>
      </html>
    `

}