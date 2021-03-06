import Assert from 'assert';
import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import UserFixtures from '../Fixtures/UserFixtures';
import GenderUtils from '../../src/Utils/GenderUtils';
import AreaUtils from '../../src/Utils/AreaUtils';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test CareTakerFetchAllService', () => {
  beforeEach('CareTakerFetchAllService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  afterEach('CareTakerFetchAllService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should fetch care takers with updated profile', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {email} = users[0];
    const isByLocation = false;
    let skills = await UserFixtures.SeedCareTakerSkills(2, email);
    skills = skills.map((skill) => _.omit(skill, ['email']));

    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const area = AreaUtils.NORTH;
    const location = 'test';
    const bio = 'test';

    await UserService.UserCareTakerUpdate({
      email,
      name,
      gender,
      contact,
      area,
      location,
      bio,
    });

    await UserService.UserCareTakerTypeCreate({
      email: 'test0@example.com',
      type: RoleUtils.CARE_TAKER_FULL_TIMER,
    });

    const results = await PetService.FetchAllCareTakers({email, isByLocation});

    Assert.deepStrictEqual(
      [
        {
          email: 'test0@example.com',
          type: RoleUtils.CARE_TAKER_FULL_TIMER,
          name,
          area,
          location,
          gender,
          contact,
          bio,
          skills,
        },
      ],
      results,
    );
  });

  it('Service should fetch care takers by location', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {email} = users[0];
    const isByLocation = true;
    const results = await PetService.FetchAllCareTakers({email, isByLocation});

    Assert.deepStrictEqual([], results);
  });
});
