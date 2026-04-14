export async function POST(request: Request) {
    try {
        const {firstName, lastName, email, phone, subject, message} = await request.json()
        const body = {
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
        }
        await fetch(process.env.GOOGLE_SHEET_URL as string , {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
        return Response.json({ message: "Message sent successfully" }, {status: 200})
    } catch (error) {
        console.log(error)
        return Response.json({ message: "Failed to send message" }, {status: 500})
    }
}