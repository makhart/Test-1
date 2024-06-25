import router from "@adonisjs/core/services/router"

import PollsController from "#controllers/PollsController"

router.get("/polls", [PollsController, "polls"])
router.post("/polls/chosen", [PollsController, "chosen"])
router.get("/poll/:id", [PollsController, "poll"])
router.post("/poll/create", [PollsController, "create"])
router.post("/poll/answer", [PollsController, "answer"])
