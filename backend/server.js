const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {

    try {

        const question = req.body.message;

        if (!question || question.trim() === "") {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "openrouter/free",

                    messages: [

                        {
                            role: "system",

                            content:
                                "You are Mujeeb AI. Always try to understand the user's meaning, even when the user makes spelling mistakes, grammar mistakes, missing letters, or types informally. Do not reject a question just because it contains typos. Correctly infer what the user probably means and answer helpfully."
                        },

                        {
                            role: "user",

                            content: question
                        }

                    ]

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            return res.status(response.status).json({
                error: data
            });

        }


        if (
            !data.choices ||
            !data.choices[0] ||
            !data.choices[0].message
        ) {

            return res.status(500).json({
                error: "Invalid AI response."
            });

        }


        res.json({

            answer:
                data.choices[0].message.content

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            error: "Server error."

        });

    }

});


app.listen(3000, () => {

    console.log(
        "Mujeeb AI server is running"
    );

});