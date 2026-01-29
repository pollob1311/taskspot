

async function testPostback() {
    // Replace with your actual user ID from the admin panel
    const userId = "H74fadb42-1db1-48bf-8093-832f4cf513ca";
    const token = "YOUR_POSTBACK_TOKEN_HERE"; // If set in SystemSettings

    const params = new URLSearchParams({
        user_id: userId,
        payout: "0.50",
        network: "TimeWall",
        token: token,
        status: "success"
    });

    const url = `https://taskspot.site/api/postback?${params.toString()}`;

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
