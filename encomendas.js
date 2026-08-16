document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');

  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      // Verifica se os campos obrigatórios estão válidos
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      // Captura os valores dos campos
      const name = document.getElementById('orderName').value.trim();
      const phone = document.getElementById('orderPhone').value.trim();
      const product = document.getElementById('orderProduct').value;
      const date = document.getElementById('orderDate').value;
      const notes = document.getElementById('orderNotes').value.trim();

      // Formata a data de AAAA-MM-DD para DD/MM/AAAA para ficar mais amigável
      let formattedDate = date;
      if (date) {
        const [year, month, day] = date.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }

      // Monta o texto da mensagem para o WhatsApp
      let message = `*Nova Encomenda - L'Artisan Boulangerie*\n\n`;
      message += `*Nome:* ${name}\n`;
      message += `*Telefone:* ${phone}\n`;
      message += `*Produto:* ${product}\n`;
      message += `*Data de Retirada:* ${formattedDate}\n`;
      if (notes) {
        message += `*Observações:* ${notes}\n`;
      }

      // Substitua pelo número da sua empresa (DDI + DDD + Número, sem símbolos)
      const whatsappNumber = '556599943679';

      // Codifica a mensagem para URL
      const encodedMessage = encodeURIComponent(message);

      // Cria o link do WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Redireciona o usuário para o WhatsApp
      window.open(whatsappUrl, '_blank');
    });
  }
});