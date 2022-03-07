import 'reflect-metadata';
import Boom from '@hapi/boom';
import { Service } from 'typedi';
import { Designation } from '../models/designation';
import { getConnection } from '../utils/connection';


@Service()
export class DesignationService {
  public async getDesignationForUser(userId: string, offset: number, limit: number): Promise<[Designation[], number]> {
    const designationRepo = (await getConnection()) .getRepository(Designation);

    return designationRepo.findAndCount({
      skip: offset,
      take: limit,
      where: { userId },
    });
  }

  public async getDesignation(designationId: string): Promise<Designation> {

    const designationRepo = (await getConnection()).getRepository(Designation);
    // eslint-disable-next-line no-console
    //  console.log(designationRepo);
    // eslint-disable-next-line no-console
    console.log(designationId);
    const list = await designationRepo.findOne({

      where: { id: designationId },
    });
    // eslint-disable-next-line no-console

    if (!list) {
      throw Boom.notFound('Dsignation not found');
    }

    return list;
  }

  public async createDesignationForUser(userId: string, name: string): Promise<Designation> {
    const designationRepo = (await getConnection()) .getRepository(Designation);

    const designation = designationRepo.create({
      userId,
      name,
    });

    return designationRepo.save(designation);
  }

  public async updateDesignation(designation: Designation): Promise<Designation> {
    // eslint-disable-next-line no-console
    console.log(designation);
    const designationRepo = (await getConnection()) .getRepository(Designation);

    return designationRepo.save(designation, { reload: true });
  }

  public async removeDesignation(designation: Designation): Promise<Designation> {
    const designationRepo = (await getConnection()) .getRepository(Designation);

    return designationRepo.remove(designation);
  }

}
