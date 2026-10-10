<script lang="ts">
  import { onMount } from 'svelte';
  import { scaleLinear } from 'd3-scale';
  import {
    eventMatchesTimeline,
    eventYear,
    filterTimelineEvents,
    readTimelineState,
    timelineSearchParams,
  } from '../lib/timeline.mjs';

  export let events: any[] = [];
  export let compact = false;
  export let onSelect: (event: any) => void = () => {};

  let from = '';
  let to = '';
  let term = '';
  let selected: any = null;
  let includeUndated = true;

  $: dated = events.filter((event) => eventYear(event) !== null);
  $: min = Math.min(...dated.map((event) => eventYear(event)), 1900);
  $: max = Math.max(...dated.map((event) => eventYear(event)), 2025);
  $: scale = scaleLinear().domain([min, max]).range([25, 975]);
  $: filtered = filterTimelineEvents(events, { from, to, term, includeUndated });
  $: ticks = scale.ticks(8);
  $: periodGroups = [...new Set(dated.map((event) => Math.floor((eventYear(event) ?? 0) / 10) * 10))]
    .sort((a, b) => a - b)
    .map((year) => ({ year, count: dated.filter((event) => Math.floor((eventYear(event) ?? 0) / 10) * 10 === year).length }));
  $: densityMax = Math.max(1, ...periodGroups.map((group) => group.count));
  $: selectedPeriod = from && to && Number(to) === Number(from) + 9 ? Number(from) : null;

  function updateURL(mode: 'push' | 'replace' = 'replace') {
    if (compact) return;
    const url = new URL(location.href);
    const params = timelineSearchParams(url.search, { from, to, term, includeUndated, selected });
    url.search = params.toString();
    if (url.href === location.href) return;
    if (mode === 'push') history.pushState(null, '', url);
    else history.replaceState(null, '', url);
  }

  function applyFilters(mode: 'push' | 'replace' = 'replace') {
    if (selected && !eventMatchesTimeline(selected, { from, to, term, includeUndated })) selected = null;
    updateURL(mode);
  }

  function decade(year: number) {
    from = String(year);
    to = String(year + 9);
    includeUndated = false;
    selected = null;
    applyFilters('push');
  }

  function clearFilters() {
    from = '';
    to = '';
    term = '';
    includeUndated = true;
    selected = null;
    updateURL('push');
  }

  function pick(event: any) {
    selected = event;
    onSelect(event);
    updateURL('push');
  }

  function restoreFromURL() {
    const state = readTimelineState(location.search, events);
    from = state.from;
    to = state.to;
    term = state.term;
    includeUndated = state.includeUndated;
    selected = state.selected;
    if (new URLSearchParams(location.search).has('event') && !selected) updateURL();
  }

  onMount(() => {
    if (compact) return;
    restoreFromURL();
    window.addEventListener('popstate', restoreFromURL);
    return () => window.removeEventListener('popstate', restoreFromURL);
  });
</script>

<section class="timeline-box" aria-label="Linked timeline">
  <div class="section-head" style="margin-top:0">
    <p class="eyebrow">{compact ? 'This chapter in time' : 'Explore the chronology'}</p>
    {#if compact}<a href="/timeline/">Full timeline →</a>{/if}
  </div>

  {#if !compact}
    <div class="timeline-controls">
      <label>From year<input type="number" min="1000" max="2100" bind:value={from} on:change={() => applyFilters()}/></label>
      <label>To year<input type="number" min="1000" max="2100" bind:value={to} on:change={() => applyFilters()}/></label>
      <label><span>Undated</span><input type="checkbox" bind:checked={includeUndated} on:change={() => applyFilters()}/></label>
      <label class="timeline-search">Find an event<input type="search" placeholder="Search dates and accounts" bind:value={term} on:input={() => applyFilters()}/></label>
      <button on:click={clearFilters}>Clear filters</button>
    </div>

    <div class="period-head"><h2>Choose a decade</h2><p>Move from left to right through the history. Select a decade to focus the events below.</p></div>
    <nav class="period-nav" aria-label="Timeline decades">
      <button class="period-choice" class:active={!from && !to} aria-pressed={!from && !to} on:click={clearFilters}>
        <strong>All years</strong><span>{dated.length} dated events</span>
      </button>
      {#each periodGroups as group}
        <button class="period-choice" class:active={selectedPeriod === group.year} aria-pressed={selectedPeriod === group.year} on:click={() => decade(group.year)}>
          <strong>{group.year}s</strong><span>{group.count} {group.count === 1 ? 'event' : 'events'}</span>
          <i class="period-density" aria-hidden="true" style={'--density:' + Math.round(group.count / densityMax * 100) + '%'}></i>
        </button>
      {/each}
    </nav>
  {/if}

  <svg class="timeline-svg" viewBox="0 0 1000 65" role="img" aria-label="Event dates overview. Use the labelled events below to explore.">
    <line x1="25" y1="25" x2="975" y2="25"/>
    {#each ticks as tick}
      <line x1={scale(tick)} y1="20" x2={scale(tick)} y2="32"/>
      <text x={scale(tick)} y="55" text-anchor="middle">{tick}</text>
    {/each}
    {#each filtered.filter((event) => eventYear(event) !== null) as event}
      {#if event.endDate && Number(event.endDate.slice(0, 4)) > eventYear(event)}
        <rect x={scale(eventYear(event))} y="21" width={Math.max(3, scale(Number(event.endDate.slice(0, 4)))-scale(eventYear(event)))} height="8"/>
      {:else}
        <circle cx={scale(eventYear(event))} cy="25" r="3"/>
      {/if}
    {/each}
  </svg>

  <div class="timeline-result-count" aria-live="polite">{filtered.length} of {events.length} events {#if !compact}· Select an event for its summary, sources and related account{/if}</div>
  <div class="timeline-rail" tabindex="0" aria-label="Chronological event buttons">
    {#each filtered as event}
      <button class="timeline-event" aria-pressed={selected?.id === event.id} on:click={() => pick(event)}>
        <small>{event.dateDisplay} · {event.datePrecision}</small><span>{event.label}</span>
      </button>
    {/each}
  </div>

  {#if !filtered.length}<p class="empty">No events in this period. Clear the filters to see all dates.</p>{/if}
  {#if selected}
    <section class="event-summary" aria-live="polite">
      <h3>{selected.label}</h3><p>{selected.summary}</p><small>{selected.dateDisplay} · {selected.datePrecision} precision</small>
      {#if selected.url}<p><a href={selected.url}>Read the linked account →</a></p>{/if}
      {#if selected.sources?.length}
        <details class="sources"><summary>Event sources</summary><ul>{#each selected.sources as source}<li>{#if source.url && (/^https?:\/\//.test(source.url) || source.url.startsWith('/'))}<a href={source.url}>{source.label}</a>{:else}{source.label}{/if}</li>{/each}</ul></details>
      {/if}
    </section>
  {/if}
</section>
