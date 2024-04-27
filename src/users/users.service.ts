import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { randomBytes } from 'crypto';
import * as Parser from 'rss-parser';
import { Job } from './entities/job.entity';
import axios from 'axios';

const GRAPHQL_ENDPOINT = 'https://morfyus.com/engine/v1/graphql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async getUserById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
  // async getDatafromUsername(username: string) {
  //   const data = this.usersRepository.findOneBy({ username });
  //   console.log(data, 1212112);
  //   return data;
  // }

  async getUser(where: object): Promise<Users> {
    const data = this.usersRepository.findOneBy(where);
    console.log({ data }, 121212);
    return data;
  }

  createNewUser({
    email,
    password,
    role,
    isCompleted,
  }: {
    email: string;
    password: string;
    role: string;
    isCompleted: boolean;
  }) {
    return this.usersRepository.save({
      email,
      password,
      role,
      isCompleted,
      confirmEmailToken: randomBytes(32).toString('hex'),
      isEmailConfirmed: false,
    });
  }

  updateUserRefreshTokenById(
    id: number,
    { refreshToken }: { refreshToken: string },
  ) {
    return this.usersRepository.update(id, { refreshToken: refreshToken });
  }

  updateUserById(id: number, updates: object) {
    return this.usersRepository.update(id, updates);
  }

  updateUser(find: object, updates: object) {
    return this.usersRepository.update(find, updates);
  }

  async checkExistingJob(headline) {
    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
            query MyQuery($headline: String = "") {
              job(where: { headline: { _eq: $headline } }) {
                headline
                id
              }
            }
          `,
          variables: { headline },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': 'M0rfYuSD8@2023',
          },
        },
      );
      return response?.data?.data?.job?.length;
    } catch (error) {
      console.error('Error in checkExistingJob', error.message);
      return null;
    }
  }

  async saveJobPost(job) {
    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
          mutation CreateJob(
            $category: String
            $description: String
            $fixPrice: Int
            $headline: String
            $paymentOption: String
            $priceMax: Int
            $priceMin: Int
            $userId: Int
            $publicationCost: String
            $isDeleted: Boolean
            $isActive: Boolean
            $isAdminDeleted: Boolean
            $skillsJob: [skills_job_insert_input!]!
          ) {
            insert_job(
              objects: {
                category: $category
                description: $description
                fixPrice: $fixPrice
                headline: $headline
                paymentOption: $paymentOption
                priceMax: $priceMax
                priceMin: $priceMin
                publicationCost: $publicationCost
                userId: $userId
                isDeleted: $isDeleted
                isActive: $isActive
                isAdminDeleted: $isAdminDeleted
                skillsJob: { data: $skillsJob}
    
              }
            ) {
              __typename
            }
          }
        `,
          variables: job,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': 'M0rfYuSD8@2023',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error in saveJob', error.message);
      return false;
    }
  }

  async getSkillsFromDb() {
    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
          query getSkills {
            skills {
              id
              name
            }
          }
          `,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': 'M0rfYuSD8@2023',
          },
        },
      );
      return response?.data?.data?.skills || [];
    } catch (error) {
      console.error('Error in getSkillsFromDb', error.message);
      return [];
    }
  }

  async saveAllSkills(skillObjects) {
    console.log('skillObjects-->', skillObjects);
    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
            mutation MyMutation($objects: [skills_insert_input!] = {}) {
              insert_skills(objects: $objects) {
                returning {
                  createdAt
                  id
                  name
                  updatedAt
                }
              }
            }
          `,
          variables: {
            objects: skillObjects,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': 'M0rfYuSD8@2023',
          },
        },
      );
      return response?.data;
    } catch (error) {
      console.error('Error in saveAllSkills', error.message);
      return false;
    }
  }

  async createJob() {
    const rssFeed = [
      {
        url: 'https://weworkremotely.com/remote-jobs.rss',
        descriptionKey: 'content',
      },
      // {
      //   url: 'https://authenticjobs.com/?feed=job_feed',
      //   descriptionKey: 'content:encoded',
      // },
      // {
      //   url: 'https://jobicy.com/?feed=job_feed',
      //   descriptionKey: 'content:encoded',
      // },
      // {
      //   url: 'https://jobicy.com/api/v2/remote-jobs',
      //   descriptionKey: 'content:encoded',
      // },
    ];

    const skillsData = await this.getSkillsFromDb();
    console.log('skillsData', skillsData);
    let missingCategories = [];
    let maxId = 0;
    await (skillsData || []).forEach((skill) => {
      if (skill?.id > maxId) {
        maxId = skill?.id;
      }
    });
    console.log('maxId', maxId);

    const parser = new Parser();

    const processCategory = (category) => {
      const foundCategory = skillsData.find(
        (skill) => skill?.name?.toLowerCase() == category?.toLowerCase(),
      );
      if (foundCategory) {
        return foundCategory['id'];
      } else {
        const missingCategory = missingCategories.find(
          (cat) => cat?.name?.toLowerCase() == category?.toLowerCase(),
        );
        if (missingCategory) {
          return missingCategory?.id;
        } else {
          maxId++;
          missingCategories.push({
            id: maxId,
            name: category,
          });
          console.log('missingCategories?', missingCategories);
          return maxId;
        }
      }
    };

    await Promise.all(
      rssFeed.map(async ({ url, descriptionKey }) => {
        try {
          const feed = await parser.parseURL(url);
          const { items } = feed || {};
          console.log('allJob', items?.length);
          if (!items?.length) {
            console.log('Job Not Found');
            return false;
          }

          await Promise.all(
            (items || []).map(async (item) => {
              const categories = item?.categories || [];
              const skillsId = [];
              await Promise.all(
                categories.map(async (category) => {
                  const id = await processCategory(category);
                  skillsId.push({ skillId: id });
                }),
              );
              const description = item[descriptionKey];
              const job = {
                description: description,
                category: 'Full-time',
                paymentOption: 'FIX_PRICE',
                publicationCost: 'Default',
                userId: 39,
                isDeleted: false,
                isActive: true,
                isAdminDeleted: false,
                headline: item?.title,
                skillsJob: skillsId,
              };
              const jobData = await this.checkExistingJob(item?.title);
              if (!jobData) {
                setTimeout(async () => {
                  const saveJob = await this.saveJobPost(job);
                  if (!saveJob) {
                    return false;
                  }
                  console.log('saveJob', saveJob);
                }, 500);
              }
            }),
          );
          const saveSkills = await this.saveAllSkills(missingCategories);
          if (!saveSkills) {
            return false;
          }
        } catch (error) {
          console.error('Error in rssFeedMap', error);
          return false;
        }
      }),
    );

    return true;
  }

  async deleteJob() {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
    const currentDate = new Date().toISOString();

    return axios
      .post(
        'http://host.docker.internal:8080/v1/graphql',
        {
          query: `
            mutation MyMutation($createdAt: timestamptz!, $deletedAt: timestamptz!) {
              update_job(where: {createdAt: {_lt: $createdAt}}, _set: {isAdminDeleted: true, deleted_at: $deletedAt}) {
                returning {
                  id
                  headline
                }
              }
            }
          `,
          variables: {
            createdAt: twoMonthsAgo.toISOString(),
            deletedAt: currentDate,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': '123456',
          },
        },
      )
      .then((response) => {
        console.log('response', response?.data?.data?.update_job?.returning);
        return true;
      })
      .catch((error) => {
        console.error('Error in deleteJob', error);
        return false;
      });
  }
}
