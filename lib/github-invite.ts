const REPO_OWNER = "pandey0"
const REPO_NAME = "dsa-vault-pro-build"

export const GITHUB_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/

type InviteContext = { paymentId?: string; referenceId?: string }

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "dsa-vault-site",
    "Content-Type": "application/json",
  }
}

// GitHub 422s a PUT that doesn't strictly upgrade the invitee's current/pending
// permission (re-asking for the same or a lower level fails even though it's a no-op).
// A repeat payment for someone already invited/collaborating would hit that 422 every
// time, so we check first and skip the PUT when there's nothing to do.
async function isExistingCollaborator(username: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${encodeURIComponent(username)}`,
    { headers: githubHeaders(token) }
  )
  return res.status === 204
}

async function hasPendingInvitation(username: string, token: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/invitations`, {
    headers: githubHeaders(token),
  })

  if (!res.ok) {
    return false
  }

  const invitations = (await res.json()) as Array<{ invitee?: { login?: string } }>
  return invitations.some((invitation) => invitation.invitee?.login?.toLowerCase() === username.toLowerCase())
}

export async function inviteCollaborator(username: string, context: InviteContext = {}) {
  const token = process.env.GITHUB_TOKEN
  const logContext = { username, ...context }

  if (!token) {
    console.error("GITHUB_TOKEN is not configured; cannot invite collaborator.", logContext)
    return
  }

  try {
    if (await isExistingCollaborator(username, token)) {
      console.log("GitHub invite skipped: already a collaborator.", logContext)
      return
    }

    if (await hasPendingInvitation(username, token)) {
      console.log("GitHub invite skipped: invitation already pending.", logContext)
      return
    }
  } catch (err) {
    console.error("Failed to check existing GitHub collaborator/invitation status:", { ...logContext, err })
    // Fall through and attempt the invite anyway — worst case GitHub rejects it and
    // that failure is logged below with full context.
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${encodeURIComponent(username)}`,
    {
      method: "PUT",
      headers: githubHeaders(token),
      body: JSON.stringify({ permission: "pull" }),
    }
  )

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error("Failed to invite GitHub collaborator:", {
      ...logContext,
      githubStatus: res.status,
      githubBody: body,
    })
    return
  }

  console.log("GitHub invite created.", logContext)
}
