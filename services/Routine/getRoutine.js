async function getRoutine() {
    const userPrompt = document.getElementById('user-prompt').value;
    const bearerToken = `bearer ${"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"}`;
    //to do : enhance the prompt to provide a clear and consistent structure for the routine
    const prompt = `Generate a detailed workout routine based on the following user input: ${userPrompt}. The routine should include warm-up exercises, main workout sets, and cool-down stretches. Provide specific exercises, repetitions, and durations where applicable.\
    make it a 4 weeks rout`;
    try {
        const response = await fetch('/api/getRoutine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerToken
            },
            body: JSON.stringify({ prompt: userPrompt })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const routine = data[0].content.text || 'No routine generated.';
        /*[
    {
        "id": "msg_67b73f697ba4819183a15cc17d011509",
        "type": "message",
        "role": "assistant",
        "content": [
            {
                "type": "output_text",
                "text": "Under the soft glow of the moon, Luna the unicorn danced through fields of twinkling stardust, leaving trails of dreams for every child asleep.",
                "annotations": []
            }
        ]
    }
]*/ //from https://platform.openai.com/docs/guides/text

        //routine here is a string 

        //to do : parse the string into a more structured format for weekly routine display
        return routine;
    } catch (error) {
        console.error('Error fetching routine:', error);
        throw error;
    }
}