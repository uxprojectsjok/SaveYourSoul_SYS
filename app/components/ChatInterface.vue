<template>
  <div class="h-full flex flex-col relative">
    <!-- ── NACHRICHTEN-AREA ──────────────────────────────────────────── -->
    <div
      ref="scrollEl"
      class="flex-1 overflow-y-auto"
      :style="{ paddingBottom: inputAreaHeight + 'px' }"
    >
      <!-- Leerer Zustand -->
      <div
        v-if="messages.length === 0"
        class="flex flex-col items-center justify-center h-full text-center px-8 py-16"
      >
        <p
          class="text-xs tracking-[0.2em] text-[var(--sys-fg-dim)] uppercase"
        >
          Bereit
        </p>
      </div>

      <!-- Nachrichten als Transcript -->
      <div class="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
        <div
          v-for="(msg, idx) in messages"
          :key="msg.id"
          class="py-4"
          :class="[
            msg.role === 'assistant' ? 'chat-bubble-ai' : 'chat-bubble-user',
            idx === messages.length - 1 ? 'last-bubble' : '',
          ]"
        >
          <!-- KI-Nachricht (links) -->
          <div
            v-if="msg.role === 'assistant'"
            class="flex gap-2.5 mr-12 sm:mr-24"
          >
            <!-- Robot-Icon statt Akzentpunkt -->
            <div class="flex items-center gap-2 mb-1.5 justify-end">
              <img
                src="/icons/robot.png"
                alt="SYS"
                class="w-12 h-12 rounded-xl flex-none mt-0.5 object-cover opacity-90"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span
                  class="text-xs tracking-[0.12em] uppercase px-1.5 py-0.5 rounded border font-medium border-[var(--sys-border)] bg-transparent text-[var(--sys-fg-dim)]"
                  >{{ props.role === "soul" ? "SEELE" : "SESSION" }}</span
                >
              </div>

              <!-- Typing Indicator / Generierungs-Spinner -->
              <div
                v-if="msg.streaming"
                class="flex items-center gap-2 h-5"
              >
                <template v-if="msg.generatingLabel">
                  <svg
                    class="w-3.5 h-3.5 text-[var(--sys-violet)] flex-none animate-spin"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  >
                    <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
                  </svg>
                  <span class="text-xs text-[var(--sys-fg-dim)] tracking-[0.12em] uppercase">
                    {{ msg.generatingLabel }}
                  </span>
                </template>
                <template v-else>
                  <span
                    v-for="i in 3" :key="i"
                    class="w-1 h-1 rounded-full bg-[var(--sys-accent)]"
                    :style="`animation: soul-pulse 1.4s ease-in-out infinite; animation-delay: ${(i - 1) * 220}ms`"
                  ></span>
                </template>
              </div>

              <!-- Normaler Chat-Text (nicht Kamera-Pipeline) -->
              <div
                v-if="msg.text && !msg.mediaUrl"
                class="font-content text-sm sm:text-sm text-[var(--sys-fg)] leading-relaxed"
                v-html="renderText(msg.text)"
              ></div>

              <!-- WaveSpeed generiertes Bild -->
              <div v-if="msg.mediaType === 'image' && msg.mediaUrl" class="mt-2">
                <img
                  :src="msg.mediaUrl"
                  alt=""
                  class="w-full rounded-2xl"
                  loading="lazy"
                />
              </div>

              <!-- WaveSpeed generiertes Video -->
              <div v-else-if="msg.mediaType === 'video' && msg.mediaUrl" class="mt-2">
                <video
                  :src="msg.mediaUrl"
                  controls autoplay loop muted playsinline
                  class="w-full rounded-2xl"
                ></video>
              </div>

              <!-- Soul-Text nach generiertem Bild/Video -->
              <div
                v-if="msg.postText && msg.mediaUrl"
                class="mt-3 flex items-start gap-2"
              >
                <div
                  class="font-content flex-1 text-sm sm:text-sm text-[var(--sys-fg)] leading-relaxed"
                  v-html="renderText(msg.postText)"
                ></div>
                <!-- Replay-Button (nur wenn Audio vorhanden) -->
                <button
                  v-if="msg.audioUrl"
                  class="flex-none mt-0.5 w-7 h-7 flex items-center justify-center rounded-full border border-[var(--sys-border)] transition-colors"
                  :class="_audioPlaying
                    ? 'opacity-30 cursor-not-allowed text-[var(--sys-fg-dim)]'
                    : 'text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:border-[var(--sys-fg-dim)]'"
                  :disabled="_audioPlaying"
                  title="Nochmal abspielen"
                  @click="replayAudio(msg.audioUrl)"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"/>
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"/>
                  </svg>
                </button>
              </div>

              <!-- Vision-Auswahl: Bildantwort oder Videoantwort? -->
              <div v-if="msg.visionChoice" class="mt-3 flex flex-col gap-2">
                <p class="text-xs text-[var(--sys-fg-dim)]">Soll ich eine Bildantwort oder Videoantwort generieren?</p>
                <div class="flex gap-2">
                  <button
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sys-border)] text-xs text-[var(--sys-fg-muted)] hover:border-[var(--sys-violet)] hover:text-[var(--sys-violet)] transition-colors"
                    @click="handleVisionChoice('image', msg.id)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z"/>
                    </svg>
                    Bildantwort
                  </button>
                  <button
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sys-border)] text-xs text-[var(--sys-fg-muted)] hover:border-[var(--sys-violet)] hover:text-[var(--sys-violet)] transition-colors"
                    @click="handleVisionChoice('video', msg.id)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
                    </svg>
                    Videoantwort
                  </button>
                </div>
              </div>

              <!-- Vault-Bilder die die KI zeigen möchte -->
              <div
                v-if="msg.vaultImages?.length"
                class="mt-3 flex flex-wrap gap-2"
              >
                <template v-for="img in msg.vaultImages" :key="img.name">
                  <!-- Verschlüsseltes Bild: Lock-Platzhalter -->
                  <div
                    v-if="img.ciphered"
                    class="flex flex-col items-center justify-center gap-1.5 w-[120px] h-[90px] rounded border border-[var(--sys-border)] bg-white/[0.03] text-white/35"
                    :title="img.name"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <span class="text-[10px] text-center px-1 leading-tight">Verschlüsselt – nicht anzeigbar</span>
                  </div>
                  <!-- Normales Bild -->
                  <img
                    v-else
                    :src="img.url"
                    :alt="img.name"
                    class="max-w-[220px] rounded border border-[var(--sys-border)]"
                  />
                </template>
              </div>
            </div>
          </div>

          <!-- Nutzer-Nachricht (rechts) -->
          <div
            v-else-if="msg.role === 'user'"
            class="flex flex-col items-end ml-12 sm:ml-24"
          >
            <div class="flex items-center gap-2 mb-1.5 justify-end">
              <img
                src="/icons/mee.png"
                alt="Ich"
                class="w-8.5 h-8.5 rounded-xl flex-none mt-0.5 object-cover opacity-90"
              />
            </div>

            <!-- Bild-Vorschau (Vision-Upload) -->
            <div v-if="msg.mediaType === 'image' && msg.mediaUrl" class="mb-2">
              <img
                :src="msg.mediaUrl"
                :alt="msg.text"
                class="max-w-[200px] rounded border border-[var(--sys-border)]"
              />
            </div>

            <!-- Audio-Player -->
            <div
              v-else-if="msg.mediaType === 'audio' && msg.mediaUrl"
              class="mb-2 w-full max-w-xs"
            >
              <audio
                :src="msg.mediaUrl"
                controls
                class="w-full h-10 rounded"
                style="accent-color: var(--sys-accent)"
              ></audio>
            </div>

            <!-- Video-Player -->
            <div
              v-else-if="msg.mediaType === 'video' && msg.mediaUrl"
              class="mb-2"
            >
              <video
                :src="msg.mediaUrl"
                controls
                class="w-full max-w-xs rounded border border-[var(--sys-border)]"
              ></video>
            </div>

            <!-- YouTube-Embed -->
            <div v-if="msg.youtubeEmbed" class="mb-2">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${msg.youtubeEmbed.videoId}`"
                class="w-full max-w-xs aspect-video rounded border border-[var(--sys-border)]"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>

            <!-- Spotify-Embed -->
            <div v-if="msg.spotifyEmbed" class="mb-2">
              <iframe
                :src="`https://open.spotify.com/embed/track/${msg.spotifyEmbed.id}?utm_source=generator&theme=0`"
                class="w-full max-w-xs rounded border border-[var(--sys-border)]"
                style="height: 80px"
                frameborder="0"
                allow="
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  fullscreen;
                  picture-in-picture;
                "
                loading="lazy"
              ></iframe>
            </div>

            <!-- Link-Karte -->
            <div v-if="msg.linkCard" class="mb-2">
              <a
                :href="msg.linkCard.url"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--sys-border)] text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.2)] transition-all text-xs max-w-xs"
              >
                <span
                  v-if="msg.linkCard.service === 'youtube'"
                  class="text-red-400"
                  >▶</span
                >
                <span
                  v-else-if="msg.linkCard.service === 'spotify'"
                  class="text-green-400"
                  >♫</span
                >
                <span v-else class="opacity-60">🔍</span>
                <span class="truncate">{{ msg.linkCard.label }}</span>
                <span class="flex-none opacity-40">→</span>
              </a>
            </div>

            <p
              v-if="msg.text"
              class="font-content text-sm sm:text-sm text-[var(--sys-fg)] leading-relaxed text-right bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.09)] rounded-2xl px-4 py-2.5"
            >
              {{ msg.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Fehler -->
      <div v-if="error" class="max-w-3xl mx-auto px-4 sm:px-6 py-3">
        <div
          class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.18)]"
        >
          <svg
            class="w-3.5 h-3.5 text-red-400/70 flex-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p class="text-xs text-red-400/80">
            {{
              error?.includes?.("fetch")
                ? "Verbindungsfehler – Verbindung zur KI fehlgeschlagen."
                : error
            }}
          </p>
        </div>
      </div>

      <!-- Scroll-Anker -->
      <div ref="chatEnd" class="h-1"></div>
    </div>

    <!-- ── EINGABE-BEREICH ────────────────────────────────────────────── -->
    <!-- Kein voller Hintergrund – nur die gerundete Karte, backdrop-blur als Trenner -->
    <div
      ref="inputArea"
      class="absolute bottom-0 left-0 right-0 pointer-events-none"
    >
      <div
        class="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pointer-events-auto"
        style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 1.25rem)"
      >
        <!-- Vault-Picker Overlay (alle Datei-Typen) -->
        <Transition name="slide-up">
          <div
            v-if="vaultPickerOpen"
            class="mb-2 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-elevated)] p-3"
          >
            <div class="flex items-center justify-between mb-2.5">
              <span
                class="text-xs tracking-[0.18em] text-[var(--sys-fg-dim)] uppercase font-semibold"
                >Vault · Dateien</span
              >
              <button
                @click="vaultPickerOpen = false"
                aria-label="Picker schließen"
                class="w-7 h-7 flex items-center justify-center text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] rounded-lg transition-colors hover:bg-[var(--sys-accent-dim)]"
              >
                <svg
                  class="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <!-- Bilder als Thumbnail-Grid -->
            <div
              v-if="vaultPickerImages.length"
              class="flex flex-wrap gap-2 mb-2"
            >
              <button
                v-for="img in vaultPickerImages"
                :key="img.name"
                @click="selectVaultFile(img)"
                class="rounded-lg border border-[var(--sys-border)] overflow-hidden hover:border-[var(--sys-accent)] transition-all"
                :aria-label="img.name"
              >
                <img
                  :src="img.url"
                  :alt="img.name"
                  class="w-14 h-14 object-cover"
                />
              </button>
            </div>
            <!-- Alle anderen Dateien als Liste -->
            <div v-if="vaultPickerFiles.length" class="flex flex-col gap-1">
              <button
                v-for="f in vaultPickerFiles"
                :key="f.name"
                @click="selectVaultFile(f)"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--sys-border)] hover:border-[var(--sys-border-accent)] hover:bg-[var(--sys-accent-dim)] transition-all text-left w-full"
                :aria-label="f.name"
              >
                <svg
                  class="w-3.5 h-3.5 flex-none text-[var(--sys-fg-dim)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <span class="text-xs text-[var(--sys-fg)] truncate flex-1">{{
                  f.name
                }}</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- ── Typo-Bestätigung ──────────────────────────────────────────── -->
        <Transition name="slide-up">
          <div
            v-if="pendingMatch"
            class="mb-2 rounded-xl border border-[var(--sys-violet-border)] bg-[var(--sys-violet-dim)] px-4 py-3 flex items-start gap-3"
          >
            <i class="ri-search-eye-line text-[var(--sys-violet)] text-sm flex-none mt-0.5" aria-hidden="true" />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-[var(--sys-fg)] mb-0.5">
                Meintest du <span class="text-[var(--sys-violet)]">{{ pendingMatch.conn.alias }}</span>?
              </p>
              <p class="text-xs text-[var(--sys-fg-dim)] leading-relaxed">
                „{{ pendingMatch.matchedWord }}" → <span class="font-mono opacity-70">{{ pendingMatch.conn.soul_id.slice(0, 8) }}…</span> — im Netzwerk gefunden.
              </p>
            </div>
            <div class="flex items-center gap-2 flex-none">
              <button
                @click="cancelMatch"
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--sys-fg-dim)] border border-[var(--sys-border)] hover:text-[var(--sys-fg)] hover:bg-white/[0.07] transition min-h-[32px]"
              >Abbrechen</button>
              <button
                @click="confirmMatch"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[var(--sys-violet)] hover:opacity-90 transition min-h-[32px] active:scale-[0.97]"
              >Ja, senden</button>
            </div>
          </div>
        </Transition>

        <!-- ── Input Card ── -->
        <div
          class="rounded-2xl border border-[var(--sys-border)] bg-[var(--sys-bg-elevated)] backdrop-blur-xl transition-all duration-300 focus-within:border-[rgba(255,255,255,0.18)]"
        >
          <!-- Zeile 1: Textarea + Send Button -->
          <div class="flex items-center gap-2 pl-7 pr-4 pt-3 pb-2">
            <textarea
              ref="textareaEl"
              v-model="inputText"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="newLine"
              @input="autoResize"
              placeholder="Schreib etwas…"
              rows="1"
              class="flex-1 resize-none bg-transparent text-sm sm:text-base text-[var(--sys-fg)] placeholder:text-[var(--sys-fg-dim)] focus:outline-none leading-relaxed min-h-[44px] max-h-[160px] py-[10px] pl-3"
            ></textarea>

            <!-- Send Button -->
            <button
              @click="sendMessage"
              :disabled="!canSend"
              aria-label="Nachricht senden"
              class="flex-none w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                canSend
                  ? 'bg-[var(--sys-fg)] text-[var(--sys-bg)] hover:bg-white active:scale-95'
                  : 'bg-[var(--sys-accent-dim)] border border-[var(--sys-border)] opacity-20 cursor-not-allowed'
              "
            >
              <svg
                class="w-4 h-4 text-[var(--sys-bg)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 19V5m-7 7 7-7 7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Trennlinie -->
          <div class="h-px mx-4 bg-[var(--sys-border)]"></div>

          <!-- Zeile 2: Kamera-Button + Chips scrollbar + Ladeindikator -->
          <div class="flex items-center px-3 py-2.5 gap-2">

            <div
              class="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style="-webkit-overflow-scrolling: touch; padding: 4px 0"
            >
              <!-- Kamera-Button (scrollt mit den Chips) -->
              <button
                class="sys-chip flex-none gap-1.5 select-none touch-none"
                :class="cameraOpen
                  ? 'border-[rgba(255,255,255,0.30)] bg-[rgba(255,255,255,0.12)] text-white'
                  : visionLoading
                    ? 'border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] text-white/60'
                    : ''"
                :disabled="visionLoading"
                @click="cameraOpen = true"
                title="Kamera · Foto oder Video aufnehmen"
                aria-label="Kamera"
              >
                <svg
                  class="w-3.5 h-3.5 flex-none"
                  :class="visionLoading ? 'animate-pulse' : ''"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
                </svg>
                <span>{{ visionLoading ? 'Analyse…' : 'Kamera' }}</span>
              </button>

              <button
                v-for="pill in searchPills"
                :key="pill.prefix"
                @click="insertSearch(pill.prefix)"
                :aria-label="pill.label"
                class="sys-chip flex-none"
                :class="
                  inputText.startsWith(pill.prefix.trimEnd())
                    ? 'border-[rgba(139,92,246,0.55)] bg-[rgba(139,92,246,0.12)] text-white shadow-[0_0_10px_rgba(139,92,246,0.20)]'
                    : ''
                "
              >
                {{ pill.label }}
              </button>
            </div>

            <!-- Ladeindikator -->
            <div v-if="isLoading || visionLoading" class="flex-none flex items-center gap-1.5">
              <span
                v-for="i in 3"
                :key="i"
                class="w-1 h-1 rounded-full opacity-60"
                :class="visionLoading ? 'bg-[var(--sys-violet)]' : 'bg-[var(--sys-amber)]'"
                :style="`animation: soul-pulse 1.2s ease-in-out infinite; animation-delay: ${(i - 1) * 180}ms`"
              ></span>
            </div>

            <!-- Verlassen-Warnung während Generierung -->
            <div
              v-if="visionLoading"
              class="flex-none flex items-center gap-1 text-xs text-[var(--sys-violet)] opacity-60 tracking-wide"
              title="Fortschritt geht verloren wenn du den Chat verlässt"
            >
              <svg class="w-3 h-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
              </svg>
              <span>Nicht schließen</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CameraRecorder Overlay -->
    <CameraRecorder
      :is-open="cameraOpen"
      @captured="handleCameraCapture"
      @cancel="cameraOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useClaude } from "~/composables/useClaude.js";
import { useSession } from "~/composables/useSession.js";
import { useVault } from "~/composables/useVault.js";
import { useYouTube } from "~/composables/useYouTube.js";
import { useSpotify } from "~/composables/useSpotify.js";
import { useVaultConnections } from "~/composables/useVaultConnections.js";
import { fetchAllPublicVaults, fetchPublicVaultImage } from "~/composables/useConnectedVault.js";
import { useApiContext } from "~/composables/useApiContext.js";
import { useConfirm } from "~/composables/useConfirm.js";
const { ask } = useConfirm();
import CameraRecorder from "~/components/CameraRecorder.vue";

const props = defineProps({
  soulContent: { type: String, default: "" },
  soulCert: { type: String, default: "" },
  role: { type: String, default: "soul" }, // "soul" | "session"
});

const emit = defineEmits(["cert-error"]);

const { chat, isLoading, error, certError } = useClaude();
const { connections, fetchConnections } = useVaultConnections();

// imageManifest: { [soul_id]: { alias, files: string[] } } – wird bei jedem dispatchToChat neu befüllt
const publicImageManifest = ref({});

// Network-Context-Cache: einmal pro Session aufbauen, nicht bei jeder Nachricht
const _networkCtxCache   = ref(null);  // null = noch nicht geladen
const _networkCtxCert    = ref("");    // cert für den der Cache gilt

watch(certError, (val) => {
  if (val) emit("cert-error");
});
const {
  messages,
  conversationSummary,
  addMessage,
  updateLastMessage,
  setLastMessageMeta,
  setMessageMetaById,
  toApiMessages,
  getMessagesToSummarize,
  pruneWithSummary,
} = useSession();
const { contextText, profileBase64, fileManifest, allFiles, readImageFile, readImageAsBase64, writeFile, isConnected: vaultConnected } =
  useVault();
const { syncedFiles, loadContext } = useApiContext();
const { isConnected: ytConnected, accessToken: ytToken } = useYouTube();
const { isConnected: spConnected, accessToken: spToken } = useSpotify();

const inputText = ref("");
const textareaEl = ref(null);
const scrollEl = ref(null);
const chatEnd = ref(null);
const inputArea = ref(null);
const inputAreaHeight = ref(72);

// ── Typo-Matching: Name-Erkennung ──────────────────────────────────────────
const pendingMatch = ref(null); // { text, msgMeta, conn, matchedWord }

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function findConnectionMatch(text, conns) {
  if (!conns.length) return null;
  const words = text.split(/[\s.,!?;:()[\]]+/).filter(w => w.length >= 2);
  for (const conn of conns) {
    const alias = conn.alias;
    const aLow = alias.toLowerCase();
    for (const word of words) {
      if (word === alias) continue; // exakter Treffer, keine Bestätigung nötig
      const wLow = word.toLowerCase();
      const dist = levenshtein(wLow, aLow);
      // Treffer bei: gleicher Buchstabe anderer Schreibung (jan → Jan) ODER ≤1 Tippfehler
      if (wLow === aLow || (dist <= 1 && aLow.length >= 3)) {
        return { conn, matchedWord: word };
      }
    }
  }
  return null;
}

function confirmMatch() {
  if (!pendingMatch.value) return;
  const { text, msgMeta } = pendingMatch.value;
  pendingMatch.value = null;
  dispatchToChat(text, msgMeta);
}

function cancelMatch() {
  if (!pendingMatch.value) return;
  inputText.value = pendingMatch.value.text;
  pendingMatch.value = null;
  nextTick(() => textareaEl.value?.focus());
}

// ── Kamera / Vision-Pipeline ───────────────────────────────────────────────
const cameraOpen = ref(false);
const visionLoading = ref(false);

// Pending Vision-Auswahl: wird gesetzt nachdem Vision-Analyse die Textantwort geliefert hat.
// Enthält alles was für die Generierung nötig ist — wird nach Auswahl verbraucht.
const pendingVisionChoice = ref(null); // { genPrompt, vaultProfileB64, getRandomProfileB64, soulReaction }

// ── Schutz: Generierung läuft → Verlassen abfangen ────────────────────────
const LEAVE_WARNING = "Eine Generierung läuft noch. Wenn du jetzt gehst, geht der Fortschritt verloren.";

function _onBeforeUnload(e) {
  e.preventDefault();
  e.returnValue = LEAVE_WARNING;
  return LEAVE_WARNING;
}

watch(visionLoading, (running) => {
  if (running) window.addEventListener("beforeunload", _onBeforeUnload);
  else         window.removeEventListener("beforeunload", _onBeforeUnload);
});

onBeforeRouteLeave(async (_to, _from) => {
  if (!visionLoading.value) return true;
  return await ask({ title: 'Seite verlassen?', message: LEAVE_WARNING + ' Trotzdem verlassen?', confirmText: 'Verlassen', danger: false });
});

// AudioContext für TTS – wird beim User-Gesture (handleCameraCapture) entsperrt,
// damit play() später aus async-Kontext heraus funktioniert.
let _audioCtx = null;
const _audioBuffers = new Map(); // blobUrl → ArrayBuffer (für Replay ohne fetch)
const _audioPlaying = ref(false);  // verhindert Doppel-Trigger auf Replay
function _unlockAudio() {
  if (_audioCtx) return;
  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    _audioCtx.resume().catch(() => {});
  } catch { _audioCtx = null; }
}

const canSend = computed(
  () => inputText.value.trim().length > 0 && !isLoading.value,
);

const searchPills = computed(() => {
  const base = [
    { prefix: "@search-local", label: "Datei" },
    { prefix: "@search-youtube ", label: "YouTube" },
    { prefix: "@search-spotify ", label: "Spotify" },
    { prefix: "@search-google ", label: "Web" },
  ];
  if (allFiles.value.length > 0) {
    base.splice(1, 0, { prefix: "@search-vault-image", label: "Vault" });
  }
  return base;
});

// ── Vault Picker (alle Datei-Typen) ───────────────────────────────────────
const vaultPickerOpen = ref(false);
const vaultPickerImages = ref([]); // [{ name, url, file }] – Bilder
const vaultPickerFiles = ref([]); // [{ name, file }]      – Text/Sonstiges
const vaultPickerBlobUrls = [];

// Fügt @search-Prefix in den Input ein – bei @search-local sofort senden
async function insertSearch(prefix) {
  if (prefix.trim() === "@search-vault-image") {
    openVaultPicker();
    return;
  }
  inputText.value = prefix;
  await nextTick(autoResize);
  if (prefix.trim() === "@search-local") {
    sendMessage();
  } else {
    textareaEl.value?.focus();
    const el = textareaEl.value;
    if (el) el.selectionStart = el.selectionEnd = el.value.length;
  }
}

async function openVaultPicker() {
  if (!allFiles.value.length) return;
  const imgs = [];
  const txts = [];
  for (const entry of allFiles.value) {
    const file = await readImageFile(entry.name); // liest beliebige Vault-Dateien
    if (!file) continue;
    if (entry.kind === "image" || entry.kind === "profile") {
      const url = URL.createObjectURL(file);
      vaultPickerBlobUrls.push(url);
      imgs.push({ name: entry.name, url, file });
    } else {
      txts.push({ name: entry.name, file });
    }
  }
  vaultPickerImages.value = imgs;
  vaultPickerFiles.value = txts;
  vaultPickerOpen.value = true;
}

async function selectVaultFile(entry) {
  vaultPickerOpen.value = false;
  const result = await handleLocalFile(entry.file);
  if (!result) return;
  const msgMeta = {};
  if (result.contentBlocks) msgMeta.contentBlocks = result.contentBlocks;
  if (result.mediaUrl) {
    msgMeta.mediaUrl = result.mediaUrl;
    msgMeta.mediaType = result.mediaType;
  }
  await dispatchToChat(result.text, msgMeta);
}

// ── Textarea ──────────────────────────────────────────────────────────────

function autoResize() {
  const el = textareaEl.value;
  if (!el) return;
  el.style.height = "0";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
  updateInputHeight();
}

function updateInputHeight() {
  if (inputArea.value) {
    inputAreaHeight.value = inputArea.value.offsetHeight + 20;
  }
}

function newLine() {
  inputText.value += "\n";
  nextTick(autoResize);
}

// ── Scroll ────────────────────────────────────────────────────────────────

async function scrollToBottom() {
  await nextTick();
  chatEnd.value?.scrollIntoView({ behavior: "smooth", block: "end" });
}

// ── Minimal Markdown render ───────────────────────────────────────────────

function renderText(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /`(.+?)`/g,
      '<code class="px-1 py-0.5 rounded text-xs bg-[var(--sys-bg-overlay)] font-mono">$1</code>',
    )
    .replace(/\n/g, "<br>");
}

// ── @search-Keywords ──────────────────────────────────────────────────────

function parseSearchCommand(text) {
  const t = text.trim();
  if (/^@search-local(\s|$)/i.test(t)) return { type: "local", query: "" };
  const m = t.match(/^@search-(youtube|spotify|google)\s*(.*)/is);
  if (m) return { type: m[1].toLowerCase(), query: m[2].trim() };
  return null;
}

// Gibt File-Objekt zurück (oder null bei Abbruch)
async function pickLocalFile() {
  if ("showOpenFilePicker" in window) {
    try {
      const [handle] = await window.showOpenFilePicker({ multiple: false });
      return await handle.getFile();
    } catch (e) {
      if (e.name === "AbortError") return null;
    }
  }
  // Fallback für iOS Safari / Browser ohne File System Access API
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => resolve(input.files[0] || null);
    input.click();
  });
}

// Blob-URLs für Inline-Player – werden bei Unmount freigegeben
const mediaBlobUrls = [];

// Bild auf max. 1024px komprimieren → JPEG base64 (ohne data:-Präfix)
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.75).split(",")[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load"));
    };
    img.src = url;
  });
}

// Datei als base64 lesen (ohne data:-Präfix)
function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}

const AUDIO_EXT = /\.(mp3|ogg|wav|flac|aac|m4a|opus|weba)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|avi|mkv|m4v)$/i;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;
const PDF_EXT = /\.pdf$/i;
const MAX_PDF = 5 * 1024 * 1024; // 5 MB

// Gibt { text, contentBlocks } zurück – contentBlocks ist null oder API-Array
async function handleLocalFile(file) {
  const name = file.name;

  // ── Audio → Inline-Player im Chat ───────────────────────────────────
  if (AUDIO_EXT.test(name)) {
    const url = URL.createObjectURL(file);
    mediaBlobUrls.push(url);
    return {
      text: `[Musik: "${name}" – ich höre gerade]`,
      contentBlocks: null,
      mediaUrl: url,
      mediaType: "audio",
    };
  }

  // ── Video → Inline-Player im Chat ───────────────────────────────────
  if (VIDEO_EXT.test(name)) {
    const url = URL.createObjectURL(file);
    mediaBlobUrls.push(url);
    return {
      text: `[Video: "${name}" – ich schaue gerade]`,
      contentBlocks: null,
      mediaUrl: url,
      mediaType: "video",
    };
  }

  // ── Bild → komprimieren → Claude Vision + Inline-Preview ──────────────
  if (IMAGE_EXT.test(name)) {
    let base64;
    try {
      base64 = await compressImage(file);
    } catch {
      return { text: `[Bild: "${name}" – Ladefehler]`, contentBlocks: null };
    }
    const previewUrl = URL.createObjectURL(file);
    mediaBlobUrls.push(previewUrl);
    return {
      text: `[Bild: "${name}"]`,
      contentBlocks: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/jpeg", data: base64 },
        },
        {
          type: "text",
          text: `[Bild: "${name}" – bitte beschreib es und stell eine Frage dazu]`,
        },
      ],
      mediaUrl: previewUrl,
      mediaType: "image",
    };
  }

  // ── PDF → Claude Document ─────────────────────────────────────────────
  if (PDF_EXT.test(name)) {
    if (file.size > MAX_PDF) {
      return {
        text: `[PDF: "${name}" – zu groß (max. 5 MB)]`,
        contentBlocks: null,
      };
    }
    const base64 = await fileToBase64(file);
    return {
      text: `[PDF: "${name}"]`,
      contentBlocks: [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        },
        {
          type: "text",
          text: `[Dokument: "${name}" – bitte beschreib den Inhalt und stell eine Frage dazu]`,
        },
      ],
    };
  }

  // ── Text/Markdown/JSON/sonstiges → als Text-Kontext senden ───────────
  const TEXT_EXT =
    /\.(txt|md|json|csv|xml|yaml|yml|log|js|ts|py|sh|html|css)$/i;
  if (TEXT_EXT.test(name) || file.size < 100_000) {
    try {
      const text = await file.text();
      return {
        text: `[Datei: "${name}"]`,
        contentBlocks: [
          {
            type: "text",
            text: `Dateiinhalt von "${name}":\n\n${text.slice(0, 20000)}${text.length > 20000 ? "\n…(gekürzt)" : ""}`,
          },
        ],
      };
    } catch {
      /* fall through */
    }
  }

  return {
    text: `[Datei: "${name}" – Format nicht unterstützt]`,
    contentBlocks: null,
  };
}

// ── YouTube / Spotify API-Suche ────────────────────────────────────────────

async function searchYouTubeApi(query) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1`,
      { headers: { Authorization: `Bearer ${ytToken.value}` } },
    );
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;
    return { videoId: item.id.videoId, title: item.snippet.title };
  } catch {
    return null;
  }
}

async function searchSpotifyApi(query) {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${spToken.value}` } },
    );
    const data = await res.json();
    const track = data.tracks?.items?.[0];
    if (!track) return null;
    return { id: track.id, title: `${track.name} – ${track.artists[0]?.name}` };
  } catch {
    return null;
  }
}

// Gibt { text, contentBlocks, ...embed-Felder } zurück oder null bei Abbruch
async function handleSearchCommand(cmd) {
  if (cmd.type === "local") {
    const file = await pickLocalFile();
    if (!file) return null;
    return await handleLocalFile(file);
  }

  const safe = cmd.query
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 200);
  if (!safe) return null;

  if (cmd.type === "youtube") {
    if (ytConnected.value) {
      const yt = await searchYouTubeApi(safe);
      if (yt)
        return {
          text: `[YouTube: "${yt.title}"]`,
          contentBlocks: null,
          youtubeEmbed: yt,
        };
    }
    return {
      text: `[YouTube-Suche: "${safe}"]`,
      contentBlocks: null,
      linkCard: {
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(safe)}`,
        service: "youtube",
        label: safe,
      },
    };
  }

  if (cmd.type === "spotify") {
    if (spConnected.value) {
      const sp = await searchSpotifyApi(safe);
      if (sp)
        return {
          text: `[Spotify: "${sp.title}"]`,
          contentBlocks: null,
          spotifyEmbed: sp,
        };
    }
    return {
      text: `[Spotify-Suche: "${safe}"]`,
      contentBlocks: null,
      linkCard: {
        url: `https://open.spotify.com/search/${encodeURIComponent(safe)}`,
        service: "spotify",
        label: safe,
      },
    };
  }

  if (cmd.type === "google") {
    return {
      text: `[Web-Suche: "${safe}"]`,
      contentBlocks: null,
      linkCard: {
        url: `https://www.google.com/search?q=${encodeURIComponent(safe)}`,
        service: "google",
        label: safe,
      },
    };
  }

  return null;
}

// ── Vault-Bilder aus KI-Antwort laden ────────────────────────────────────

const vaultImageBlobUrls = [];

async function scanForVaultImages() {
  const last = messages.value[messages.value.length - 1];
  if (!last || last.role !== "assistant") return;
  const text = last.text ?? "";
  // Früher Ausstieg – kein Fetch wenn keine Vault-Bild-Referenz
  if (!text.includes("[vault-img:") && !text.includes("[public-vault-img:")) return;
  const vaultImages = [];

  // ── Eigene Vault-Bilder: [vault-img: dateiname] ───────────────────────────
  const localImgs = fileManifest.value.imageFiles ?? [];
  const vpsImgs   = syncedFiles.value?.images ?? [];
  const knownImgs = localImgs.length ? localImgs : vpsImgs;
  const pattern = /\[vault-img:\s*([^\]]+)\]/gi;
  for (const m of [...text.matchAll(pattern)]) {
    const name = m[1].trim();
    // Sicherheitscheck: nur bekannte Dateinamen
    if (!knownImgs.includes(name) && fileManifest.value.profile !== name) continue;
    let url = null;
    if (vaultConnected.value) {
      // Lokaler Vault bevorzugt
      const file = await readImageFile(name);
      if (file) { url = URL.createObjectURL(file); vaultImageBlobUrls.push(url); }
    }
    if (!url && props.soulCert) {
      // Fallback: VPS-Endpoint
      try {
        const r = await fetch(`/api/vault/images/${encodeURIComponent(name)}`, {
          headers: { Authorization: `Bearer ${props.soulCert}` }
        });
        if (r.ok) {
          const blob = await r.blob();
          url = URL.createObjectURL(blob);
          vaultImageBlobUrls.push(url);
        }
      } catch { /* nicht kritisch */ }
    }
    if (url) vaultImages.push({ name, url });
  }

  // ── Public Vault Bilder: [public-vault-img: soul_id/dateiname] ───────────
  const pubPattern = /\[public-vault-img:\s*([^/\]]+)\/([^\]]+)\]/gi;
  for (const m of [...text.matchAll(pubPattern)]) {
    const soul_id = m[1].trim();
    const filename = m[2].trim();
    // Nur fetchen wenn soul_id im bekannten Manifest – verhindert halluzinierte IDs
    const manifestEntry = publicImageManifest.value[soul_id];
    if (!manifestEntry) continue;
    if (!/^[a-zA-Z0-9_-]{4,128}$/.test(soul_id) || !/^[a-zA-Z0-9._-]{1,120}$/.test(filename)) continue;
    const alias = manifestEntry.alias ?? soul_id.slice(0, 8) + "…";
    const filenameBase = filename.replace(/\.[^.]+$/, '');

    // Kanonischen Dateinamen aus Manifest – erst offene, dann verschlüsselte prüfen
    const canonicalFile = manifestEntry.files.find(
      f => f === filename || f.replace(/\.[^.]+$/, '') === filenameBase
    );
    if (canonicalFile) {
      const url = await fetchPublicVaultImage(props.soulCert, soul_id, canonicalFile);
      if (!url) continue;
      vaultImageBlobUrls.push(url);
      vaultImages.push({ name: `${alias}/${canonicalFile}`, url });
      continue;
    }

    // Verschlüsseltes Bild vorhanden aber nicht renderbar → Hinweis-Eintrag
    const cipheredFile = (manifestEntry.cipheredFiles ?? []).find(
      f => f === filename || f.replace(/\.[^.]+$/, '') === filenameBase
    );
    if (cipheredFile) {
      vaultImages.push({ name: `${alias}/${cipheredFile}`, url: null, ciphered: true });
    }
  }

  if (vaultImages.length) setLastMessageMeta("vaultImages", vaultImages);
}

// ── Kamera-Pipeline: Capture → Gemini Vision → WaveSpeed ─────────────────

/**
 * Wird von CameraRecorder.vue ausgelöst wenn der Nutzer ein Foto oder Video aufgenommen hat.
 * Pipeline:
 *   1. Vault speichern
 *   2. Gemini 2.0 Flash Lite → Bild-Analyse + Generierungs-Prompt
 *   3. WaveSpeed AI → Bild (banana-pro) oder Video (Kling)
 *   4. Ergebnis im Chat-Bubble anzeigen
 */
async function handleCameraCapture(capture) {
  _unlockAudio(); // AudioContext sofort beim User-Gesture entsperren
  cameraOpen.value = false;
  visionLoading.value = true;

  // 1. Im Vault speichern (falls verbunden)
  if (vaultConnected.value) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -1);
    const folder = capture.type === "photo" ? "images" : "videos";
    const ext = capture.type === "photo" ? "jpg" : "webm";
    await writeFile(`${folder}/cam_${ts}.${ext}`, capture.blob).catch(() => {});
  }

  // 2. Nutzer-Nachricht mit Vorschau hinzufügen
  const previewBlobUrl = URL.createObjectURL(capture.blob);
  mediaBlobUrls.push(previewBlobUrl);
  addMessage("user", capture.caption || "", {
    mediaUrl: previewBlobUrl,
    mediaType: capture.type === "photo" ? "image" : "video",
  });
  await scrollToBottom();

  // 3. KI-Nachricht – Lade-Indikator
  addMessage("assistant", "", { streaming: true });

  // 4. Profil-Basis ermitteln (lokal oder vom VPS)
  //    Cross-Device: wenn kein lokaler Vault → profile.jpg vom VPS holen
  const authHeader = { Authorization: `Bearer ${props.soulCert}` };

  async function fetchBase64FromVPS(filename) {
    try {
      const r = await fetch(`/api/vault/images/${encodeURIComponent(filename)}`, { headers: authHeader });
      if (!r.ok) return null;
      const blob = await r.blob();
      return new Promise((res) => {
        const fr = new FileReader();
        fr.onload = (e) => res(e.target.result.split(",")[1]);
        fr.readAsDataURL(blob);
      });
    } catch { return null; }
  }

  // Aktuelles Profilbild (lokal > VPS)
  let vaultProfileB64 = profileBase64.value ?? null;
  if (!vaultProfileB64 && props.soulCert) {
    vaultProfileB64 = await fetchBase64FromVPS("profile.jpg");
  }

  // Archivierte Profilbilder (für Video-Randomisierung: lokal > VPS-Listing)
  async function getRandomProfileB64() {
    // Lokale Archive zuerst
    const localArchives = fileManifest.value.profileArchives ?? [];
    const localPool = [fileManifest.value.profile, ...localArchives].filter(Boolean);
    if (localPool.length > 0) {
      const pick = localPool[Math.floor(Math.random() * localPool.length)];
      const b64  = await readImageAsBase64(pick).catch(() => null);
      if (b64) return b64;
    }
    // VPS-Fallback: profile.jpg + profile_1…N.jpg ausprobieren
    const candidates = [vaultProfileB64];
    for (let n = 1; n <= 9; n++) {
      const b64 = await fetchBase64FromVPS(`profile_${n}.jpg`);
      if (b64) candidates.push(b64); else break;
    }
    const valid = candidates.filter(Boolean);
    return valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : vaultProfileB64;
  }

  // Soul-Reaktion + Szenen-Prompt via Vision-Analyse
  let soulReaction = "";
  let genPrompt    = "";
  try {
    const vRes = await fetch("/api/vision-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        imageBase64: capture.frameBase64 ?? capture.base64,
        mimeType: "image/jpeg",
        transcript: capture.caption ?? capture.transcript ?? "",
        soulContext: [props.soulContent, contextText.value].filter(Boolean).join("\n\n").slice(0, 800),
      }),
    });
    if (vRes.ok) {
      const vData  = await vRes.json();
      soulReaction = vData.soulReaction ?? vData.analysis ?? "";
      genPrompt    = vData.genPrompt ?? "";
    }
  } catch { /* weiter ohne Vision */ }

  const captionText = capture.caption || capture.transcript || "";
  if (captionText && genPrompt) genPrompt = genPrompt.slice(0, 90) + ", " + captionText.slice(0, 40);

  // ── Textantwort zeigen + Auswahl anbieten ────────────────────────────────
  // Seele hat das Bild analysiert. Jetzt erst Textreaktaion zeigen,
  // dann fragen ob Bild- oder Videoantwort gewünscht.
  updateLastMessage(soulReaction || "");
  setLastMessageMeta("streaming", false);
  visionLoading.value = false;
  await scrollToBottom();

  if (soulReaction) speakSoulReaction(soulReaction);

  // Kein Profilbild → kein Angebot zur Bildgenerierung
  if (!vaultProfileB64) return;

  // Auswahl-Nachricht hinzufügen + pending State speichern
  pendingVisionChoice.value = { genPrompt, vaultProfileB64, getRandomProfileB64, soulReaction };
  addMessage("assistant", "", { visionChoice: true });
  await scrollToBottom();
}

// ── Vision-Auswahl: Nutzer hat Bild- oder Videoantwort gewählt ────────────
async function handleVisionChoice(mode, msgId) {
  const pending = pendingVisionChoice.value;
  if (!pending) return;
  pendingVisionChoice.value = null;

  const { genPrompt, vaultProfileB64, getRandomProfileB64, soulReaction } = pending;
  const authHeader = { Authorization: `Bearer ${props.soulCert}` };

  // Choice-Nachricht in Generierungs-Bubble umwandeln
  setLastMessageMeta("visionChoice", false);
  setLastMessageMeta("streaming", true);
  visionLoading.value = true;
  await scrollToBottom();

  async function waveSubmit(wMode, prompt, imageBase64) {
    const r = await fetch("/api/wavespeed-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ outputMode: wMode, prompt, imageBase64 }),
    });
    if (!r.ok) return null;
    return (await r.json()).taskId ?? null;
  }

  async function wavePoll(taskId, maxTries = 100) {
    for (let i = 0; i < maxTries; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const r = await fetch(`/api/wavespeed-result?id=${encodeURIComponent(taskId)}`, { headers: authHeader });
        if (!r.ok) continue;
        const d = await r.json();
        if (d.status === "completed" && d.url) return d.url;
        if (d.status === "failed") return null;
      } catch { /* weiter */ }
    }
    return null;
  }

  if (mode === "video") {
    // ── Video: zufälliges Profilbild → Kling animiert es direkt ──────────
    setLastMessageMeta("generatingLabel", "Kling v3.0 Pro · Video");
    await scrollToBottom();

    const videoBase64 = await getRandomProfileB64();
    const videoPrompt = (genPrompt.slice(0, 95) + ", slow cinematic camera drift, atmospheric").slice(0, 150)
      || "cinematic slow pan, atmospheric, photorealistic";

    let videoUrl = null;
    try {
      const tid = await waveSubmit("image-to-video", videoPrompt, videoBase64);
      if (tid) videoUrl = await wavePoll(tid, 80);
    } catch { /* */ }

    if (videoUrl) {
      setLastMessageMeta("mediaUrl", videoUrl);
      setLastMessageMeta("mediaType", "video");
    } else {
      updateLastMessage("_Video-Generierung nicht verfügbar._");
    }
    setLastMessageMeta("postText", soulReaction || "");

  } else {
    // ── Bild: edit-multi mit profile.jpg → Face-Swap in neue Szene ───────
    setLastMessageMeta("generatingLabel", "Nano Banana Pro · Face-Swap");
    await scrollToBottom();

    const editPrompt = genPrompt || "cinematic portrait, photorealistic, atmospheric, soft light";
    let sceneUrl = null;

    try {
      const tid = await waveSubmit("edit-multi", editPrompt, vaultProfileB64);
      if (tid) {
        const PATIENCE_MS = 20_000;
        let patienceTimer;
        const patienceP = new Promise((res) => {
          patienceTimer = setTimeout(() => res("patience"), PATIENCE_MS);
        });
        const pollP = wavePoll(tid, 100).then((url) => {
          clearTimeout(patienceTimer);
          return url;
        });

        const first = await Promise.race([pollP, patienceP]);

        if (first === "patience") {
          const patienceText = "mmmh, momentan dauert die Bildgenerierung, lass uns weiter sprechen...";
          updateLastMessage(patienceText);
          setLastMessageMeta("streaming", false);
          setLastMessageMeta("generatingLabel", null);
          visionLoading.value = false;
          await scrollToBottom();

          sceneUrl = await pollP;
          if (sceneUrl) {
            const spontaneous = await fetchSpontaneousImageReaction();
            const imgMsg = addMessage("assistant", "", {
              mediaUrl: sceneUrl,
              mediaType: "image",
              postText: spontaneous,
            });
            await scrollToBottom();
            if (spontaneous) speakAndAttachAudio(spontaneous, imgMsg.id);
          }
          return;
        }

        sceneUrl = first;
      }
    } catch { /* */ }

    if (sceneUrl) {
      setLastMessageMeta("mediaUrl", sceneUrl);
      setLastMessageMeta("mediaType", "image");
    } else {
      updateLastMessage("_Face-Swap nicht verfügbar._");
    }
    setLastMessageMeta("postText", soulReaction || "");
  }

  setLastMessageMeta("streaming", false);
  setLastMessageMeta("generatingLabel", null);
  visionLoading.value = false;
  await scrollToBottom();
}

// ── TTS: Audio an bestimmte Nachricht hängen (für Hintergrund-Generierung) ──
async function speakAndAttachAudio(text, msgId) {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.soulCert}` },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return;
    const arrayBuf = await res.arrayBuffer();
    const blob = new Blob([arrayBuf], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    _audioBuffers.set(url, arrayBuf);
    setMessageMetaById(msgId, "audioUrl", url);
    _playAudio(arrayBuf);
  } catch { /* kein Audio ist kein Fehler */ }
}

// ── Spontane Soul-Reaktion wenn Bild verzögert fertig wird ────────────────
async function fetchSpontaneousImageReaction() {
  try {
    const soulName = (() => {
      const m = props.soulContent?.match(/^soul_name:\s*(.+)$/m);
      return m ? m[1].trim() : null;
    })();
    const systemPrompt = soulName
      ? `Du bist ${soulName}. Reagiere in 1–2 Sätzen kurz, lebendig und spontan auf Deutsch. Kein "Ich bin KI".`
      : "Reagiere in 1–2 Sätzen kurz, lebendig und spontan auf Deutsch.";
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.soulCert || "anonymous"}` },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 80,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: "Das Bild ist jetzt fertig. Sag spontan etwas Lebendiges dazu." }],
      }),
    });
    if (!res.ok) return "";
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") break;
        try {
          const p = JSON.parse(data);
          if (p?.type === "content_block_delta" && p?.delta?.type === "text_delta") {
            text += p.delta.text ?? "";
          }
        } catch { /* */ }
      }
    }
    return text.trim();
  } catch { return ""; }
}

// ── TTS: Soul-Stimme nach Bild/Video ──────────────────────────────────────
async function speakSoulReaction(text) {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.soulCert}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return; // kein Audio → kein Problem, Text bleibt sichtbar

    const arrayBuf = await res.arrayBuffer();
    const blob = new Blob([arrayBuf], { type: "audio/mpeg" });
    const url  = URL.createObjectURL(blob);

    // Buffer im Speicher halten → Replay ohne fetch (CSP erlaubt kein fetch auf blob:)
    _audioBuffers.set(url, arrayBuf);

    // URL in Message-Metadata speichern → Replay-Button
    setLastMessageMeta("audioUrl", url);

    // Abspielen via AudioContext (entsperrt beim User-Gesture)
    _playAudio(arrayBuf);
  } catch { /* kein Audio ist kein Fehler */ }
}

function _playAudio(arrayBuf) {
  if (!_audioCtx) return;
  _audioPlaying.value = true;
  _audioCtx.resume()
    .then(() => _audioCtx.decodeAudioData(arrayBuf.slice(0)))
    .then((audioBuf) => {
      const src = _audioCtx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(_audioCtx.destination);
      src.onended = () => { _audioPlaying.value = false; };
      src.start(0);
    })
    .catch(() => { _audioPlaying.value = false; });
}

function replayAudio(url) {
  if (_audioPlaying.value) return;
  const buf = _audioBuffers.get(url);
  if (buf) _playAudio(buf);
}

// ── Gemeinsamer Chat-Dispatcher ────────────────────────────────────────────

async function buildVaultContext() {
  let ctx = contextText.value;
  // Lokale Vault-Bilder haben Vorrang; Fallback auf VPS-syncedFiles wenn kein Vault verbunden
  const localImgs = fileManifest.value.imageFiles ?? [];
  const vpsImgs   = syncedFiles.value?.images ?? [];
  const imgs = localImgs.length ? localImgs : vpsImgs;
  if (imgs.length) {
    ctx += `\n\n## Bilder im Vault\n${imgs.join(", ")}\nUm ein Bild zu zeigen, schreibe: [vault-img: dateiname.jpg]`;
  }
  return ctx;
}

async function fetchNetworkContext() {
  if (!props.soulCert) return null;
  // Cache: nur einmal pro Session/Cert laden
  if (_networkCtxCache.value !== null && _networkCtxCert.value === props.soulCert) {
    return _networkCtxCache.value;
  }
  const parts = [];

  // ── Privater Vault: soul_content der verbundenen Souls ────────────────────
  try {
    const res = await fetch("/api/vault/connections/network", {
      headers: { Authorization: `Bearer ${props.soulCert}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.connections)) {
        for (const c of data.connections) {
          if (c.available && c.soul_content) {
            const content = c.soul_content.trim();
            // Verschlüsselte Inhalte überspringen – SYSCRYPT01-Magie-Bytes oder Binary-Daten
            if (content.startsWith('SYSCRYPT01') || content.startsWith('SYS\x00')) continue;
            parts.push(`### ${c.alias} (${c.soul_id.slice(0, 8)}…)\n${content}`);
          }
        }
      }
    }
  } catch { /* nicht kritisch */ }

  // ── Public Vault: Textdateien + Bild-Manifest ─────────────────────────────
  try {
    // Connections laden falls noch nicht geschehen (z.B. SoulNetworkPanel nie geöffnet)
    if (!connections.value.length) await fetchConnections();
    const { publicVaultContext, imageManifest } = await fetchAllPublicVaults(
      props.soulCert,
      connections.value
    );
    if (publicVaultContext) parts.push(publicVaultContext);
    publicImageManifest.value = imageManifest;

    // Bild-Hinweis für die KI: welche Bilder aus Public Vaults verfügbar sind
    const imgHints = [];
    for (const [soul_id, entry] of Object.entries(imageManifest)) {
      const lines = [];
      if (entry.files.length) {
        const examples = entry.files.slice(0, 3).map(f => `[public-vault-img: ${soul_id}/${f}]`).join(" oder ");
        lines.push(`  Anzeigbar: ${entry.files.join(", ")} → z.B.: ${examples}`);
      }
      if ((entry.cipheredFiles ?? []).length) {
        lines.push(`  Verschlüsselt (nicht anzeigbar): ${entry.cipheredFiles.join(", ")} – diese Dateien sind im Public Vault verschlüsselt und können nicht gerendert werden. Teile dem User mit, dass das Bild verschlüsselt ist.`);
      }
      imgHints.push(`${entry.alias} (ID: ${soul_id})\n${lines.join("\n")}`);
    }
    if (imgHints.length) {
      parts.push(`## Bilder aus verbundenen Public Vaults\nWenn nach einem anzeigbaren Bild gefragt wird, schreibe EXAKT: [public-vault-img: SOUL_ID/DATEINAME]\nVerfügbare Bilder:\n${imgHints.join("\n")}`);
    }
  } catch { /* nicht kritisch */ }

  const result = parts.length ? parts.join("\n\n") : null;
  // Cache speichern
  _networkCtxCache.value = result;
  _networkCtxCert.value  = props.soulCert;
  return result;
}

// Cache invalidieren wenn cert wechselt; VPS-Dateiliste nachladen
watch(() => props.soulCert, (cert) => {
  _networkCtxCache.value = null;
  _networkCtxCert.value  = "";
  if (cert) loadContext(cert).catch(() => {});
}, { immediate: true });

// Cache invalidieren wenn Verbindungen sich ändern (neue Soul verbunden → Bild-Manifest veraltet)
watch(() => connections.value.length, () => {
  _networkCtxCache.value = null;
});

// ── Kurzzeitgedächtnis: Alte Nachrichten komprimieren ─────────────────────
async function maybeCompressHistory() {
  const toSummarize = getMessagesToSummarize();
  if (!toSummarize.length) return;

  try {
    const summaryMessages = toSummarize.map((m) => ({
      role: m.role,
      content: m.contentBlocks || m.text,
    }));
    // Bestehende Zusammenfassung als Basis
    const existingSummary = conversationSummary.value
      ? `Bisherige Zusammenfassung:\n${conversationSummary.value}\n\nNeue Nachrichten:\n`
      : "";
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.soulCert || "anonymous"}`,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        stream: false,
        system: `${existingSummary}Fasse diesen Gesprächsverlauf prägnant zusammen. Behalte: wichtige Themen, Stimmungen, Entscheidungen, persönliche Details. Max. 5 Sätze. Auf Deutsch.`,
        messages: summaryMessages,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const summary = data?.content?.[0]?.text?.trim() || "";
      if (summary) pruneWithSummary(summary);
    }
  } catch { /* Kompression nicht kritisch */ }
}

async function dispatchToChat(text, msgMeta) {
  addMessage("user", text, msgMeta);
  await scrollToBottom();

  // History komprimieren wenn nötig (im Hintergrund, bevor die Antwort kommt)
  await maybeCompressHistory();

  addMessage("assistant", "", { streaming: true });
  const [vaultCtx, networkCtx] = await Promise.all([
    buildVaultContext(),
    fetchNetworkContext(),
  ]);
  const chatResult = await chat({
    messages: toApiMessages(),
    soulContent: props.soulContent,
    soulCert: props.soulCert,
    vaultContext: vaultCtx,
    networkContext: networkCtx,
    conversationSummary: conversationSummary.value || null,
    profileImageBase64: profileBase64.value,
    role: props.role,
    onDelta: (delta, fullText) => {
      updateLastMessage(fullText);
      scrollToBottom();
    },
  });
  setLastMessageMeta("streaming", false);
  await scanForVaultImages();
  if (!chatResult) updateLastMessage(error.value ? `_(Fehler: ${error.value})_` : "…");
  await scrollToBottom();
}

// ── Senden ────────────────────────────────────────────────────────────────

async function sendMessage() {
  if (!canSend.value) return;

  const raw = inputText.value.trim();
  inputText.value = "";
  await nextTick(autoResize);

  // @search-Keywords abfangen und in Signal umwandeln
  const cmd = parseSearchCommand(raw);
  let text = raw;
  const msgMeta = {};

  if (cmd) {
    const result = await handleSearchCommand(cmd);
    if (!result) return; // Abgebrochen (z.B. File-Picker Cancel)
    text = result.text;
    if (result.contentBlocks) msgMeta.contentBlocks = result.contentBlocks;
    if (result.mediaUrl) {
      msgMeta.mediaUrl = result.mediaUrl;
      msgMeta.mediaType = result.mediaType;
    }
    if (result.youtubeEmbed) msgMeta.youtubeEmbed = result.youtubeEmbed;
    if (result.spotifyEmbed) msgMeta.spotifyEmbed = result.spotifyEmbed;
    if (result.linkCard) msgMeta.linkCard = result.linkCard;
  }

  // Typo-Check: Fuzzy-Match gegen Netzwerk-Verbindungen
  const match = findConnectionMatch(text, connections.value);
  if (match) {
    pendingMatch.value = { text, msgMeta, ...match };
    return;
  }

  await dispatchToChat(text, msgMeta);
}

// ── Externe Nachricht (z.B. aus Search-Launcher) ──────────────────────────

async function sendExternal(text) {
  if (!text?.trim() || isLoading.value) return;
  await dispatchToChat(text, {});
}

defineExpose({ sendExternal });

// ── Lifecycle ─────────────────────────────────────────────────────────────

const resizeObserver = new ResizeObserver(updateInputHeight);

onMounted(() => {
  updateInputHeight();
  if (inputArea.value) resizeObserver.observe(inputArea.value);

  if (messages.value.length === 0) {
    addMessage("assistant", "Hallo. Ich bin hier.");
  }
});

onUnmounted(() => {
  resizeObserver.disconnect();
  mediaBlobUrls.forEach((url) => URL.revokeObjectURL(url));
  vaultPickerBlobUrls.forEach((url) => URL.revokeObjectURL(url));
  vaultImageBlobUrls.forEach((url) => URL.revokeObjectURL(url));
});
</script>
