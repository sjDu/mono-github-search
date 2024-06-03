export async function login(token: string) {
  return await Promise.resolve({
    token,
    user: {
      name: 'Tester Stark',
      email: 'tester.tony.stark@starkindustry.com'
    },
    status: 'success',
  });
}