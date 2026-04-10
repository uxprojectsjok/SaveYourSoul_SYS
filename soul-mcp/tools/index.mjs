import { register as soulRead }       from './soul_read.mjs';
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
import { register as soulMaturity }   from './soul_maturity.mjs';
import { register as soulSkills }     from './soul_skills.mjs';
import { register as profileGet }     from './profile_get.mjs';
import { register as profileSave }    from './profile_save.mjs';
import { register as soulWrite }              from './soul_write.mjs';
import { register as soulCloudPush }         from './soul_cloud_push.mjs';
import { register as elevenLabsAgentUpdate } from './elevenlabs_agent_update.mjs';
import { register as twilioCallConfig }      from './twilio_call_config.mjs';

/**
 * Registriert alle MCP-Tools am Server.
 * Token wird per Closure eingebunden – kein globaler State.
 */
export function registerTools(server, token) {
  // Identität & Verifikation
  soulRead(server, token);
  soulMaturity(server, token);
  verifyHuman(server, token);
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
  twilioCallConfig(server, token);
}
