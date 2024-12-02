const { APIContracts, APIControllers } = require('authorizenet');

const processPayment = async ({ cardNumber, expiryDate, cvc, amount }) => {
  const merchantAuthentication = new APIContracts.MerchantAuthenticationType();
  merchantAuthentication.setName(process.env.AUTHORIZE_API_LOGIN_ID);
  merchantAuthentication.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY);

  const creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(cardNumber);
  creditCard.setExpirationDate(expiryDate);
  creditCard.setCardCode(cvc);

  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const transactionRequest = new APIContracts.TransactionRequestType();
  transactionRequest.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequest.setAmount(amount);
  transactionRequest.setPayment(paymentType);

  const createTransactionRequest = new APIContracts.CreateTransactionRequest();
  createTransactionRequest.setMerchantAuthentication(merchantAuthentication);
  createTransactionRequest.setTransactionRequest(transactionRequest);

  const ctrl = new APIControllers.CreateTransactionController(createTransactionRequest.getJSON());

  return new Promise((resolve, reject) => {
    ctrl.execute(() => {
      const response = new APIContracts.CreateTransactionResponse(ctrl.getResponse());
      if (response && response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
        resolve({ success: true, transactionId: response.getTransactionResponse().getTransId() });
      } else {
        reject({
          success: false,
          error: response.getTransactionResponse()?.getErrors() || 'Payment failed',
        });
      }
    });
  });
};

module.exports = { processPayment };
