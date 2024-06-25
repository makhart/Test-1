<script setup lang="ts">
interface PollDataInterface {
    id: number
    question: string
    from: Date
    to: Date
    chosen: number
}

interface PollChosenInterface {
    pollId: number
    chosen: number
}

interface PollResponseInterface {
    data: PollDataInterface[]
    meta: {
        currentPage: number
        firstPage: number
        firstPageUrl: string
        lastPage: number
        lastPageUrl: string
        nextPageUrl?: string
        previousPageUrl?: string
        total: number
    }
}



const page = ref<number>(1)
const search = ref<string>("")



const { data: polls, refresh } = useFetch<PollResponseInterface>(() => {
    const baseUrl = `http://localhost:3333/polls?page=${page.value}`
    const searchParam = search.value ? `&search=${search.value}` : ''
    return `${baseUrl}${searchParam}`
})

const pagePoll = async (newPage: number): Promise<void> => {
    page.value = newPage
    await refresh()
    await updateAnswersCounts()
}

const searchPoll = async (): Promise<void> => {
    page.value = 1
    await refresh()
    await updateAnswersCounts()
}



const updateAnswersCounts = async (): Promise<void> => {
    if (polls) {
        const pollIds = polls.value!.data.map(poll => poll.id)
        try {
            const chosens: PollChosenInterface[] = await $fetch<PollChosenInterface[]>("http://localhost:3333/polls/chosen", {
                method: "POST",
                body: JSON.stringify({ pollIds })
            })
            chosens.forEach(chosen => {
                const poll = polls.value!.data.find(p => p.id === chosen.pollId)
                poll!.chosen = chosen.chosen
            })
        } catch (error) {
            console.error(error)
        }
    }
}

onMounted(() => {
    updateAnswersCounts()
    setInterval(updateAnswersCounts, 60000)
})



const now: Date = new Date()

const isPollActive = (poll: PollDataInterface): boolean => {
    const from: Date = new Date(poll.from)
    const to: Date = new Date(poll.to)
    return now >= from && now <= to
}

const getPollStatus = (poll: PollDataInterface): string => {
    if (isPollActive(poll)) {
        return "Aktywna"
    } else if (now < new Date(poll.from)) {
        return "Nierozpoczęta"
    } else {
        return "Zakończona"
    }
}
</script>



<template>
    <div>
        <CompositeHeader />
        <main>
            <section>
                <div>
                    <h1>Lista ankiet</h1>
                </div>
                <div>
                    <form>
                        <input v-model="search" placeholder="Wpisz nazwę ankiety">
                        <button @click="searchPoll">Szukaj</button>
                    </form>
                </div>
                <div>
                    <ul>
                        <li v-for="poll in polls?.data" :key="poll.id">
                            <div v-if="getPollStatus(poll) === 'Aktywna'">
                                <NuxtLink :to="'/poll/'+poll.id">{{ poll.question }}</NuxtLink> - <span>{{ getPollStatus(poll) }}</span> - <span>[{{ poll.chosen }}]</span>
                            </div>
                            <div v-else-if="getPollStatus(poll) === 'Nierozpoczęta'">
                                <span>{{ poll.question }}</span> - <span>{{ getPollStatus(poll) }}</span>
                            </div>
                            <div v-else-if="getPollStatus(poll) === 'Zakończona'">
                                <span>{{ poll.question }}</span> - <span>{{ getPollStatus(poll) }}</span> - <span>[{{ poll.chosen }}]</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <button @click="pagePoll(1)" :disabled="page === 1">Pierwsza</button>
                    <button v-for="pageNum in polls?.meta.lastPage" :key="pageNum" @click="pagePoll(pageNum)" :disabled="page === pageNum">{{ pageNum }}</button>
                    <button @click="pagePoll(polls!.meta.lastPage)" :disabled="page === polls?.meta.lastPage">Ostatnia</button>
                </div>
            </section>
        </main>
    </div>
</template>
