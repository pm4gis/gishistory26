<script lang="ts">
 import {onMount} from 'svelte';
 import {contributionRecipient,contributionDraft,contributionGmailUrl,contributionContextFromSearch} from '../lib/passage-contributions.mjs';

 const initial=contributionDraft();
 let subject=initial.subject;
 let message=initial.body;
 let status='';
 $: gmailUrl=contributionGmailUrl(subject,message);

 onMount(()=>{
  const context=contributionContextFromSearch(window.location.search);
  const draft=contributionDraft(context);
  subject=draft.subject;
  message=draft.body;
 });

 async function copyDetails(){
  try{
   await navigator.clipboard.writeText('To: '+contributionRecipient+'\nSubject: '+subject+'\n\n'+message);
   status='Email details copied. Paste them into your preferred email service.';
  }catch{
   status='Copy is unavailable in this browser. Select the message and copy it using Ctrl+C.';
   document.querySelector<HTMLTextAreaElement>('#contribution-message')?.select();
  }
 }
</script>

<div class="contribution-form">
 <p class="contribution-recipient">Send your contribution to <strong>{contributionRecipient}</strong>. This page prepares your email; it does not send it.</p>
 <label for="contribution-subject">Subject</label>
 <input id="contribution-subject" type="text" bind:value={subject} maxlength="300"/>
 <label for="contribution-message">Your contribution</label>
 <textarea id="contribution-message" rows="17" bind:value={message}></textarea>
 <div class="actions contribution-actions">
  <a id="gmail-compose" class="button primary" target="_blank" rel="noopener noreferrer" href={gmailUrl}>Open draft in Gmail ↗</a>
  <button id="copy-contribution" type="button" on:click={copyDetails}>Copy email details</button>
 </div>
 {#if status}<p role="status" class="contribution-status">{status}</p>{/if}
 <p class="contribution-help">The Gmail option opens a draft in your web browser when you are signed in. If you use another email service, copy the prepared details and paste them into a new message.</p>
</div>
