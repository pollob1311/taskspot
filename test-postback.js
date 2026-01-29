const fetch = require('node-fetch');

async function testPostback() {
    // Replace with your actual user ID from the admin panel
    const userId = "USER_ID_HERE";
    const token = "YOUR_POSTBACK_TOKEN_HERE"; // If set in SystemSettings

    const params = new URLSearchParams({
        uid: userId,
        payout: "0.50",
        network: "TestNetwork",
        token: token,
        status: "success"
    });

    const url = `http://localhost:3000/api/postback?${params.toString()}`;

    console.log(`Sending mock postback to: ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testPostback();
