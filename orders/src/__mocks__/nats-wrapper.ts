export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback()
        }
      ),
  },
}

// To suppress this error, find the following line in the existingOrder function of models/ticket.ts:

//     ticket: this,
// Change it to:

//     ticket: this as any,
// Complete function for context:

//   const existingOrder = await Order.findOne({
//     ticket: this as any,
//     status: {
//       $in: [
//         OrderStatus.Created,
//         OrderStatus.AwaitingPayment,
//         OrderStatus.Complete,
//       ],
//     },
//   });
