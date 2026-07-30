const REPO_OWNER = "pandey0"
const REPO_NAME = "dsa-vault-pro"

export const GITHUB_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/

export async function inviteCollaborator(username: string) {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error("GITHUB_TOKEN is not configured; cannot invite collaborator.")
    return
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${encodeURIComponent(username)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "dsa-vault-site",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permission: "pull" }),
    }
  )

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error(`Failed to invite GitHub collaborator "${username}": ${res.status} ${body}`)
  }
}
