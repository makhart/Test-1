<script setup lang="ts">
interface PollCreateInterface {
    question: string
    from: Date
    to: Date
    answers: {
        answer: string
    }[]
}

const form = ref<PollCreateInterface>({
    question: "",
    from: new Date(),
    to: new Date(),
    answers: [{ answer: "" }, { answer: "" }, { answer: "" }]
})

const addAnswer = (): void => {
    form.value.answers.push({ answer: "" })
}

const removeAnswer = (index: number): void => {
    if (form.value.answers.length > 3) {
        form.value.answers.splice(index, 1)
    }
}

const submitForm = async (): Promise<void> => {
    try {
        await $fetch("http://localhost:3333/poll/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: form.value
        })
    } catch (error) {
        console.error(error)
    }
}
</script>



<template>
    <div>
        <CompositeHeader />
        <main>
            <section>
                <div>
                    <h1>Dodaj ankietę</h1>
                </div>
                <div>
                    <form @submit.prevent="submitForm">
                        <div>
                            Pytanie <input type="text" minlength="5" maxlength="50" placeholder="Pytanie" v-model="form.question" required>
                        </div>
                        <br>
                        <div>
                            Od <input type="datetime-local" v-model="form.from" required>
                        </div>
                        <div>
                            Do <input type="datetime-local" v-model="form.to" required>
                        </div>
                        <br>
                        <div>
                            <button type="button" @click="addAnswer">Dodaj odpowiedź</button>
                        </div>
                        <br>
                        <div v-for="(answer, index) in form.answers" :key="index">
                            <input required type="text" minlength="5" maxlength="50" v-model="answer.answer" placeholder="Odpowiedź">
                            <button type="button" @click="removeAnswer(index)" v-if="form.answers.length > 3">Usuń</button>
                        </div>
                        <br>
                        <div>
                            <button type="submit">Dodaj</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    </div>
</template>
