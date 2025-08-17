import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {haveRoom} from "../../../helpers/room.helper";
import {haveCardSet} from "../../../helpers/card-set.helper";
import {haveUser} from "../../../helpers/user.helper";
import {haveRound} from "../../../helpers/round.helper";
import {haveEstimate} from "../../../helpers/estimate.helper";
import {cleanupDb} from "../../../helpers/db.helper";
import {IEstimateService} from "../../../../src/features/estimate/server/estimate.service.interface";
import {getEstimateService} from "../../../../src/features/estimate/server";
import {getDB} from "../../../../src/lib/server/db";

describe('EstimateService', () => {
    let service: IEstimateService

    beforeEach(async () => {
        service = getEstimateService();
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('submitEstimate', async () => {
        it('should create new estimate when none exists', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id}, getDB());
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'}, getDB())

            const estimate = await service.submit({
                userId: user.id,
                roundId: round.id,
                value: '5',
            })

            expect(estimate.id).not.toBeNull()
        })

        it('should update existing estimate when one exists', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id}, getDB());
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'}, getDB())
            const estimate = await haveEstimate({roundId: round.id, userId: user.id, value: '5'}, getDB())

            estimate.value = '10';

            const estimateResult = await service.submit(estimate)

            expect(estimateResult.value).toEqual('10')
        })
    })

    describe('getEstimates', () => {
        it('should return estimates and value when completed', async () => {
            const user_1 = await haveUser({email: 'test1@email.com'}, getDB());
            const user_2 = await haveUser({email: 'test2@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user_1.id}, getDB());
            const room = await haveRoom({ownerId: user_1.id, name: 'test', cardSetId: cardSet.id}, getDB());
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'completed'}, getDB())
            await haveEstimate({roundId: round.id, userId: user_1.id, value: '5'}, getDB())
            await haveEstimate({roundId: round.id, userId: user_2.id, value: '5'}, getDB())

            const result = await service.getManyByRoundId(round)

            expect(result).toHaveLength(2)

            result.forEach(estimate => {
                expect(estimate.value).toBe('5')
            })
        })

        it('should return estimates and null value when active', async () => {
            const user_1 = await haveUser({email: 'test1@email.com'}, getDB());
            const user_2 = await haveUser({email: 'test2@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user_1.id}, getDB());
            const room = await haveRoom({ownerId: user_1.id, name: 'test', cardSetId: cardSet.id}, getDB());
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'}, getDB())
            await haveEstimate({roundId: round.id, userId: user_1.id, value: '5'}, getDB())
            await haveEstimate({roundId: round.id, userId: user_2.id, value: '5'}, getDB())

            const result = await service.getManyByRoundId(round)

            expect(result).toHaveLength(2)

            result.forEach(estimate => {
                expect(estimate.value).toBeNull()
            })
        })

        it('should reject when round ID is not provided', async () => {
            const result = await service.getManyByRoundId({})

            expect(result).toHaveLength(0)
        })
    })

    describe('getEstimate', () => {
        it('should return estimate', async () => {
            const user = await haveUser({email: 'test1@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id}, getDB());
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'}, getDB())
            const estimate = await haveEstimate({roundId: round.id, userId: user.id, value: '5'}, getDB())

            const result = await service.getOneByUserIdAndRoundId(user.id, round.id)

            expect(result.value).toEqual(estimate.value)
        })

        it('should not return estimate when null', async () => {
            const result = await service.getOneByUserIdAndRoundId('test', 'test')

            expect(result).toBeNull()
        })
    })
})