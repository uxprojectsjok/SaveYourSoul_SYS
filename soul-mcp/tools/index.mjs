import { register as soulRead }       from './soul_read.mjs';
import { register as soulReadPaid }   from './soul_read_paid.mjs';
import { register as bemeChat }       from './beme_chat.mjs';
import { register as vaultManifest }  from './vault_manifest.mjs';
import { register as audioList }      from './audio_list.mjs';
import { register as audioGet }       from './audio_get.mjs';
import { register as imageList }      from './image_list.mjs';
import { register as imageGet }       from './image_get.mjs';
import { register as videoList }      from './video_list.mjs';
import { register as videoGet }       from './video_get.mjs';
import { register as contextList }    from './context_list.mjs';
import { register as contextGet }     from './context_get.mjs';
import { register as calendarRead }   from './calendar_read.mjs';
import { register as networkList }    from './network_list.mjs';
import { register as networkPeerGet } from './network_peer_get.mjs';
import { register as verifyHuman }    from './verify_human.mjs';
import { register as soulEarnings }   from './soul_earnings.mjs';
import { register as soulDiscover }   from './soul_discover.mjs';
import { register as soulPayTool }    from './soul_pay.mjs';
import { register as soulMaturity }   from './soul_maturity.mjs';
import { register as soulSkills }     from './soul_skills.mjs';
import { register as profileGet }     from './profile_get.mjs';
import { register as profileSave }    from './profile_save.mjs';
import { register as soulWrite }              from './soul_write.mjs';
import { register as soulCloudPush }         from './soul_cloud_push.mjs';
import { register as elevenLabsAgentUpdate } from './elevenlabs_agent_update.mjs';

/**
 * Registriert alle MCP-Tools am Server.
 * Token wird per Closure eingebunden – kein globaler State.
 */
export function registerTools(server, token) {
  // Identität & Verifikation
  soulRead(server, token);
  bemeChat(server, token);
  soulMaturity(server, token);
  verifyHuman(server, token);
  soulEarnings(server, token);
  soulDiscover(server, token);
  // Übersicht
  vaultManifest(server, token);
  // Medien
  audioList(server, token);
  audioGet(server, token);
  imageList(server, token);
  imageGet(server, token);
  videoList(server, token);
  videoGet(server, token);
  // Wissen & Kontext
  contextList(server, token);
  contextGet(server, token);
  calendarRead(server, token);
  // Netzwerk
  networkList(server, token);
  networkPeerGet(server, token);
  // Profile (Analyse-Ergebnisse)
  profileGet(server, token);
  profileSave(server, token);
  // Skills
  soulSkills(server, token);
  // Soul schreiben
  soulWrite(server, token);
  // Cloud-Sync
  soulCloudPush(server, token);
  // Agenten-Orchestrierung
  elevenLabsAgentUpdate(server, token);
}

/**
 * Registriert nur die Free-Tools für bezahlte externe Agenten (pol_access_token).
 * freeTools: Array von Tool-Namen aus amortization.free_tools (default: soul_read, verify_human, soul_maturity).
 * polToken: der pol_access_token des Agenten.
 */
/**
 * Öffentliche Discovery — kein Token nötig.
 * Nur soul_discover: damit können Agenten Souls finden bevor sie zahlen.
 */
export function registerDiscoverOnly(server) {
  soulDiscover(server, null);
  soulPayTool(server);
}

export function registerPaidTools(server, polToken, freeTools = []) {
  const allowed = new Set(freeTools);

  // soul_read_paid ist immer nach Zahlung verfügbar
  soulReadPaid(server, polToken);
  // Optionale freigegebene Tools (nur aus AVAILABLE_TOOLS in AgentMarketplacePanel)
  if (allowed.has('soul_discover'))           soulDiscover(server, polToken);
  if (allowed.has('soul_maturity'))           soulMaturity(server, polToken);
  if (allowed.has('soul_earnings'))           soulEarnings(server, polToken);
  if (allowed.has('soul_skills'))             soulSkills(server, polToken);
  if (allowed.has('soul_write'))              soulWrite(server, polToken); // nur Agent-Kontext
  if (allowed.has('audio_list'))              audioList(server, polToken);
  if (allowed.has('audio_get'))               audioGet(server, polToken);
  if (allowed.has('image_list'))              imageList(server, polToken);
  if (allowed.has('image_get'))               imageGet(server, polToken);
  if (allowed.has('video_list'))              videoList(server, polToken);
  if (allowed.has('video_get'))               videoGet(server, polToken);
  if (allowed.has('context_list'))            contextList(server, polToken);
  if (allowed.has('context_get'))             contextGet(server, polToken);
  if (allowed.has('calendar_read'))           calendarRead(server, polToken);
  if (allowed.has('profile_get'))             profileGet(server, polToken);
}
