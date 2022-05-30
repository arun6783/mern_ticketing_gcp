import { Ticket } from '../ticket'

it('Implement optimistic concurrency control', async () => {
  //create an instance of ticket

  const ticket = Ticket.build({
    title: 'optimistic concurrency',
    price: 20,
    userId: '123',
  })
  //save the ticket to db
  await ticket.save()

  //fetch ticket two times
  //two seperate changes
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  //save the first fetch ticket
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 21 })
  //save the second fetched ticket , this throws an error due to outdated version
  await firstInstance!.save()
  // save the second fetched ticket and expect an error

  try {
    await secondInstance!.save()
  } catch (err) {
    return
  }

  throw new Error('should not reach this point')
})

it('increments version numbers on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'should increment version',
    price: 20,
    userId: '123',
  })

  await ticket.save()

  expect(ticket.version).toEqual(0)

  await ticket.save()

  expect(ticket.version).toEqual(1)
  ticket.set({ price: 20 })
  await ticket.save()

  expect(ticket.version).toEqual(2)
})
