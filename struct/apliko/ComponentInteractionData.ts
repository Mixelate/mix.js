import crypto from 'crypto'
import { CreateNewDataStore, FindInDataStore, InsertIntoDataStore } from '../../util/data/DataStore'

export interface ComponentInteractionDataModel {
    id: string
    componentId: string
    data: string[]
    delete: boolean
}

export interface ComponentInteractionData {
    componentId: string
    data: string[]
}

export const InteractionData = CreateNewDataStore<ComponentInteractionDataModel>('interaction_data')

export const GenerateComponentInteractionDataId = async (): Promise<string> => {
    const randomId = crypto.randomBytes(16).toString('hex')
    const exists = await FindInDataStore(InteractionData, { id: randomId }).catch(_ => null)

    if (exists)
        return GenerateComponentInteractionDataId()
    return randomId
}

export const CreateComponentInteractionData = async (input: ComponentInteractionData): Promise<string> => {
    const id = await GenerateComponentInteractionDataId()

    await InsertIntoDataStore(InteractionData, {
        id,
        componentId: input.componentId,
        data: input.data,
        delete: false
    })

    return `apliko:${id}`
}

export const FetchComponentInteractionData = async (id: string): Promise<ComponentInteractionDataModel> => {
    if (!id.startsWith('apliko:'))
        return {
            id: '',
            componentId: id,
            data: [],
            delete: false
        }

    const interactionData = await FindInDataStore(InteractionData, { id: id.replace('apliko:', '') })

    if (!interactionData)
        Promise.reject()

    return interactionData
}