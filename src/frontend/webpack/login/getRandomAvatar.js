export const getRandomAvatar = () => {
  let number = Math.floor(Math.random() * (49 - 1 + 1)) + 1;

  console.log(number);
  switch (number) {
    case 1:
      return 'assistant.svg';
    case 2:
      return 'astronaut.svg';
    case 3:
      return 'businessman.svg';
    case 4:
      return 'captain.svg';
    case 5:
      return 'cashier.svg';
    case 6:
      return 'chef.svg';
    case 7:
      return 'concierge.svg';
    case 8:
      return 'cooker.svg';
    case 9:
      return 'courier.svg';
    case 10:
      return 'croupier-1.svg';
    case 11:
      return 'croupier.svg';
    case 12:
      return 'detective.svg';
    case 13:
      return 'disc-jockey.svg';
    case 14:
      return 'diver.svg';
    case 15:
      return 'doctor-1.svg';
    case 16:
      return 'doctor.svg';
    case 17:
      return 'engineer.svg';
    case 18:
      return 'farmer.svg';
    case 19:
      return 'firefighter-1.svg';
    case 20:
      return 'firefighter.svg';
    case 21:
      return 'gentleman.svg';
    case 22:
      return 'journalist.svg';
    case 23:
      return 'judge.svg';
    case 24:
      return 'loader.svg';
    case 25:
      return 'maid.svg';
    case 26:
      return 'manager.svg';
    case 27:
      return 'miner.svg';
    case 28:
      return 'motorcyclist.svg';
    case 29:
      return 'nun.svg';
    case 30:
      return 'nurse.svg';
    case 31:
      return 'pilot.svg';
    case 32:
      return 'policeman.svg';
    case 33:
      return 'postman.svg';
    case 34:
      return 'priest.svg';
    case 35:
      return 'scientist.svg';
    case 36:
      return 'sheriff.svg';
    case 37:
      return 'showman.svg';
    case 38:
      return 'soldier-1.svg';
    case 39:
      return 'soldier.svg';
    case 40:
      return 'stewardess.svg';
    case 41:
      return 'surgeon.svg';
    case 42:
      return 'swat.svg';
    case 43:
      return 'taxi-driver.svg';
    case 44:
      return 'teacher.svg';
    case 45:
      return 'welder.svg';
    case 46:
      return 'waiter.svg';
    case 47:
      return 'worker-1.svg';
    case 48:
      return 'worker.svg';
    case 49:
      return 'writer.svg';
    default:
      return 'chef.svg';
  }
};
