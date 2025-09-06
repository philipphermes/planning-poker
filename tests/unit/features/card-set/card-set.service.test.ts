import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {haveUser} from "../../../helpers/user.helper";
import {haveCardSet} from "../../../helpers/card-set.helper";
import {haveRoom} from "../../../helpers/room.helper";
import {cleanupDb} from "../../../helpers/db.helper";
import {ICardSetService} from "../../../../src/features/card-set/server/card-set.service.interface";
import {getCardSetService} from "../../../../src/features/card-set/server";

describe('CardSetService', () => {
    let service: ICardSetService

    beforeEach(async () => {
        service = getCardSetService();
    })

    afterEach(async () => {
        await cleanupDb()
    })

    describe('getUserCardSets', () => {
        it('should return user card sets', async () => {
            const user = await haveUser({email: 'test123@email.com'});
            await haveCardSet({userId: user.id})
            await haveCardSet({userId: user.id})

            const result = await service.getManyByOwnerId(user.id)

            expect(result).toHaveLength(2)
        })

        it('should return empty array when user has no card sets', async () => {
            const result = await service.getManyByOwnerId('test')

            expect(result).toEqual([])
        })
    })

    describe('getCardSetById', () => {
        it('should return card set by id and owner', async () => {
            const user = await haveUser({email: 'test123@email.com'});
            const cardSet = await haveCardSet({userId: user.id})

            const result = await service.getOneByIdAndOwnerId(cardSet.id, user.id)

            expect(result).toEqual({
                id: cardSet.id,
                name: cardSet.name,
                cards: cardSet.cards,
            })
        })

        it('should return null when card set not found', async () => {
            const result = await service.getOneByIdAndOwnerId('test', 'test')

            expect(result).toBeNull()
        })
    })

    describe('createCardSet', () => {
        it('should create a new card set', async () => {
            const user = await haveUser({email: 'test123@email.com'});
            const input = {
                name: 'New Card Set',
                cards: ['1', '2', '3', '5', '8'],
                ownerId: user.id,
            }

            const result = await service.create(input)

            expect(result.id).not.toBeNull()
        })
    })

    describe('updateCardSet', () => {
        it('should update an existing card set', async () => {
            const user = await haveUser({email: 'test123@email.com'});
            const cardSet = await haveCardSet({userId: user.id})

            cardSet.name = 'updated card set'

            const result = await service.update(cardSet)

            expect(result).toEqual({
                id: cardSet.id,
                name: cardSet.name,
                cards: cardSet.cards,
            })
        })
    })

    describe('deleteCardSet', () => {
        it('should delete card set when not used by rooms', async () => {
            const user = await haveUser({email: 'test123@email.com'});
            const cardSet = await haveCardSet({userId: user.id})

            const input = {
                id: cardSet.id,
                ownerId: user.id,
            }

            await service.deleteByIdAndOwnerId(input)
            const result = await service.getOneByIdAndOwnerId(cardSet.id, user.id)

            expect(result).toBeNull()
        })

        it('should throw ConflictError with correct message', async () => {
            const user = await haveUser({email: 'test123@email.com'});
            const cardSet = await haveCardSet({userId: user.id})
            await haveRoom({ownerId: user.id, name: 'test-room', cardSetId: cardSet.id})

            const input = {
                id: cardSet.id,
                ownerId: user.id,
            }

            await expect(service.deleteByIdAndOwnerId(input))
                .rejects
                .toThrow('Cannot delete card set as it is being used by one or more rooms');
        })
    })
})