export const loginNotificationVentas = (link,code) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Su compra fue un éxito</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: white;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
  
        .notification {
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 20px;
          max-width: 400px;
          text-align: center;
        }
  
        .notification h2 {
          margin-bottom: 20px;
          color: #333;
        }
  
        .notification p {
          color: #777;
        }
  
      </style>
    </head>
    <body>
      <div class="notification">
        <h2>Muchas gracias por confiar en nosotros</h2>
        <p>Estimado cliente, <br>
        <br />
        Su compra con el número ${code}, está en proceso de embalaje y distribución.
        En las próximas 48 hs llegará a su domicilio registrado. </p>
        Para ver el detalle de su compra ingrese <a href="${link}"> Aquí </a>.
        <p>Ante cualquier duda, quedamos a disposición. </p>
        <p>Saludos </p>
        <p>Proyecto Joyería Puga</p>
      </div>
    </body>
    </html>`
    return html;
  };