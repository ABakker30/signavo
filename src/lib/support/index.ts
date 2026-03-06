// Support service stub
// Answer-first support model

export async function handleSupportQuery(
  accountId: string,
  message: string
): Promise<string> {
  // Stub: will check account state, job logs, campaign status
  return "I'm checking your account. Support will be fully available soon.";
}
