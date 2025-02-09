export const getAllUsers = () => {
  const users = ["a", "b", "c"];
  return new Response(JSON.stringify(users));
};
