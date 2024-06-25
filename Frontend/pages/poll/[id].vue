<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from "vue-router"

interface PollInterface {
    id: number
    question: string
    from: Date
    to: Date
    answers: {
        id: number
        answer: string
    }[]
}

const route: RouteLocationNormalizedLoaded = useRoute()

const { data: poll } = await useFetch<PollInterface>("http://localhost:3333/poll/"+route.params.id)



interface PollAnswerInterface {
    pollId: number | undefined
    answerId: number | undefined
}

const form = ref<PollAnswerInterface>({
    pollId: poll.value?.id || undefined,
    answerId: undefined,
})

const hasAnswered = ref(false)

const checkCookie = (pollId: number): boolean => {
    return document.cookie.split('; ').some((item) => item.trim().startsWith("poll_" + pollId + "="))
}

const setCookie = (pollId: number): void => {
    const inOneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    document.cookie = `poll_${pollId}=answered; expires=${inOneYear.toUTCString()}; path=/`;
}

const submitForm = async (): Promise<void> => {
    if (!hasAnswered.value) {
        try {
            await $fetch("http://localhost:3333/poll/answer", {
                method: "POST",
                body: form.value
            })
            setCookie(poll.value!.id)
            hasAnswered.value = true
        } catch (error) {
            console.error(error)
        }
    }
}

onMounted(() => {
    if (poll.value) {
        hasAnswered.value = checkCookie(poll.value.id)
    }
})
</script>



<template>
    <div>
        <CompositeHeader />
        <main>
            <section>
                <div>
                    <h1>{{ poll!.question }}</h1>
                </div>
                <div>
                    <div v-if="!hasAnswered">
                        <form @submit.prevent="submitForm">
                            <div v-for="answer in poll!.answers" :key="answer.id">
                                <label>
                                    <input type="radio" :value="answer.id" name="answer" v-model="form.answerId" required> <span>{{ answer.answer }}</span>
                                </label>
                            </div>
                            <br>
                            <div>
                                <button type="submit">Odpowiedz</button>
                            </div>
                        </form>
                    </div>
                    <div v-else>
                        <p>Już odpowiedziałeś na tę ankietę. Dziękujemy!</p>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>
