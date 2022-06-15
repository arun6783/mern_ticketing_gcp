import Link from 'next/link'
const LandingPage = ({ currentUser, tickets }) => {
  console.log(tickets)
  // return currentUser ? <h1>You are signedin</h1> : <h1>You are signedout</h1>

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  //get list of tickets

  const { data } = await client.get('/api/tickets')
  return { tickets: data }
}

export default LandingPage
