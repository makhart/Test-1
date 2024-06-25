import type { HttpContext } from "@adonisjs/core/http"
import { PollCreateValidator } from "#validators/PollCreateValidator"
import { PollAnswerValidator } from "#validators/PollAnswerValidator"
import { PollChosenIdsValidator } from "#validators/PollChosenIdsValidator"
import { PageValidator } from "#validators/PageValidator"
import { DateTime } from "luxon"
import Poll from "#models/Poll"
import Chosen from "#models/Chosen"
import PollWithAnswersInterface from "#interfaces/PollWithAnswersInterface"
import PollCreateInterface from "#interfaces/PollCreateInterface"
import PollAnswerInterface from "#interfaces/PollAnswerInterface"
import PollChosenIdsInterface from "#interfaces/PollChosenIdsInterface"
import PollChosenInterface from "#interfaces/PollChosenInterface"
import PageInterface from "#interfaces/PageInterface"

export default class PollsController
{
    async polls({request}: HttpContext): Promise<Array<Poll> | undefined>
    {
        try {
            const validated: PageInterface = await request.validateUsing(PageValidator)
            const search = request.input("search", "")

            const query = Poll.query()

            if (search) {
                query.where("question", "like", `%${search}%`)
            }

            const polls: Array<Poll> = await query.paginate(validated.page, 10)
            return polls
        } catch {
            console.log("Error")
        }
    }

    async poll({request}: HttpContext): Promise<PollWithAnswersInterface>
    {
        const poll: PollWithAnswersInterface | null = await Poll.query().preload("answers").where("id", request.param("id")).first()

        if (poll) {
            return poll
        } else {
            throw new Error("Poll not found")
        }
    }

    async addPollWithAnswers(data: PollCreateInterface): Promise<void>
    {
        const poll: Poll = new Poll()
        poll.question = data.question
        poll.from = DateTime.fromISO(data.from.toISOString())
        poll.to = DateTime.fromISO(data.to.toISOString())
        await poll.save()

        await poll.related("answers").createMany(data.answers)
    }

    async addChosen(data: PollAnswerInterface): Promise<void>
    {
        const poll: Poll | null = await Poll.find(data.pollId)

        if (poll) {
            const now: Date = new Date()

            if (
                now >= new Date(poll.from.toString())
                && now <= new Date(poll.to.toString())
            ) {
                await poll.related("chosen").attach([data.answerId])
            } else {
                throw new Error("Poll is inactive")
            }
        } else {
            throw new Error("Poll not found")
        }
    }

    async getPollChosen(data: PollChosenIdsInterface): Promise<PollChosenInterface[]>
    {
        let results = []

        for (let pollId of data.pollIds) {
            const chosens = await Chosen.query()
            .where("pollId", pollId)
            .count("* as all")

            results.push({ pollId: pollId, chosen: chosens[0].$extras.all })
        }

        return results
    }

    async create({request}: HttpContext): Promise<void>
    {
        try {
            const validated: PollCreateInterface = await request.validateUsing(PollCreateValidator)
            // console.log("Success", validated)
            this.addPollWithAnswers(validated)
        } catch (error) {
            console.log("Error", error.messages)
        }
    }

    async chosen({request}: HttpContext): Promise<PollChosenInterface[] | undefined>
    {
        try {
            const validated: PollChosenIdsInterface = await request.validateUsing(PollChosenIdsValidator)
            // console.log("Success", validated)
            return this.getPollChosen(validated)
        } catch (error) {
            console.log("Error", error.messages)
        }
    }

    async answer({request}: HttpContext): Promise<void>
    {
        try {
            const validated: PollAnswerInterface = await request.validateUsing(PollAnswerValidator)
            // console.log("Success", validated)
            this.addChosen(validated)
        } catch (error) {
            console.log("Error", error.messages)
        }
    }
}
