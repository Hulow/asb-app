import { Cabinet } from '../../../domain/cabinet/cabinet'

export abstract class CabinetRepositoryOutputPort {
  public abstract save(cabinet: Cabinet): Promise<Cabinet>
  public abstract getByProductNameAndOwnerUid(
    productName: string,
    ownerUid: string,
  ): Promise<Cabinet | undefined>
  public abstract getById(cabinetUid: string): Promise<Cabinet | undefined>
  public abstract getAllCabinets(): Promise<Cabinet[] | undefined>
  public abstract getByOwnerUid(
    ownerUid: string,
  ): Promise<Cabinet[] | undefined>
}

export const CABINET_REPOSITORY_OUTPUT_PORT = Symbol.for(
  'CabinetRepositoryOutputPort',
)
