<script context="module">
  import { client, query } from '@metafy/lib/graphql';
  import { GET_COACH_PACKAGES } from '@metafy/graphql/queries';

  export async function preload(page) {
    // Always network so we have the latest availability data.
    // TODO: Availability should be it's own request later on in the flow.
    const { data } = await client.query({
      query: GET_COACH_PACKAGES,
      variables: { name: page.params.coach },
      fetchPolicy: 'network-only',
    });
    if (data?.coachProfile === null) {
      return this.redirect(302, '/404');
    }
    // FIXME: Don't leave this in:
    // FIXME: Don't leave this in:
    // FIXME: Don't leave this in:
    else if (false && data?.coachProfile?.coachPackages.length === 0) {
      return this.redirect(302, `/@${data.coachProfile.slug}`);
    }
    return { cache: data };
  }
</script>

<script>
  import * as Sapper from '@sapper/app';
  import { getContext, setContext, onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { booking } from '../_helpers/stores';
  import { BookingState, Toasts } from '@metafy/lib/stores';
  import { persistLoginQueryParams } from '../../auth/account/_helpers/login.js';

  import Button from '@metafy/components/Button.svelte';
  import FormControl from '@metafy/components/FormControl.svelte';
  import CoachGames from '@metafy/routes/@[coach]/_components/CoachGames.svelte';
  import NavigationBar from './_components/NavigationBar.svelte';

  import {
    patchCoachProfile,
    GAME1,
    GAME2,
    COACH_GAMES,
    GAME_QUESTIONS,
    AVAILABILITY,
    MANAGER_ACCOUNT,
    TEAM_MEMBERSHIPS,
  } from './_components/mock.js';
  import BookingSidebar from './_components/BookingSidebar.svelte';
  import TeamSelector from './_components/TeamSelector.svelte';
  import AddLiveBookings from './_components/AddLiveBookings.svelte';
  import BookingStatus from './_components/BookingStatus.svelte';
  import LoginCreateModal from './_components/LoginCreateModal.svelte';
  import ConnectDiscord from './_components/ConnectDiscord.svelte';
  import Payment from './_components/Payment.svelte';
  import BookingConfirmed from './_components/BookingConfirmed.svelte';

  import IconStepGame from '@metafy/assets/svgs/booking/step_game.svg';
  import IconStepSchedule from '@metafy/assets/svgs/booking/step_schedule.svg';
  import IconStepPayment from '@metafy/assets/svgs/booking/step_payment.svg';
  import IconStepPaymentConfirmed from '@metafy/assets/svgs/booking/step_payment_confirmed.svg';

  const { page } = Sapper.stores();
  const { account, isAuthenticated } = getContext('app');
  persistLoginQueryParams('route:book/login');

  export let cache = {};
  const response = query({ query: GET_COACH_PACKAGES, variables: { name: $page.params.coach }, data: cache });
  setContext('route:coach/schedule', { response });
  // TODO: Hook-up: This is just mock data, remove:
  const COACH_PROFILE = patchCoachProfile($response.data);
  const TOTAL_AMOUNT = 90;

  const isTeamManager = (isAuthenticated($account) && true) || $response.data.teamMembership?.role === 'manager';

  // TODO: same but for single coachGame
  // // If coach only has one lesson select it.
  // if (!$booking.coachGame && $response.data?.coachProfile?.coachPackages.length === 1) {
  //   $booking.coachGame = $response.data?.coachProfile?.coachPackages[0];
  // }

  // TODO: Remove this:
  $booking.coachGame = COACH_PROFILE.coachGames[0];
  $booking.pack = $booking.coachGame.livePacks[1];

  // If `null`, then the team manager is booking for himself.
  let selectedTeam;
  let isShowingTeamSelector = isTeamManager && selectedTeam === undefined;
  let isShowingGameQuestions = false;
  // Depending on the type of the booking they choose in the `steps.game` step, we'll need to show a different
  // flow in the `steps.addBookings` step.
  // `true` means we're adding live bookings, and `false` means we're adding replay bookings.
  let isAddingLiveBookings = true;
  let questionsAndAnswers = GAME_QUESTIONS.map(q => {
    return {
      question: q.question,
      answer: '',
    };
  });

  const steps = {
    game: {
      idx: 0,
      title: 'Choose game',
      subtitle: 'To continue, pick your game and the coaching service you need.',
      icon: IconStepGame,
    },
    addBookings: {
      idx: 1,
      title: 'Session details',
      // TODO: This doesn't work because its not reactive, fix
      subtitle: isAddingLiveBookings
        ? 'Book sessions you wish to schedule now and save remaining for later.'
        : 'Choose replays you wish to review now and save remaining for later.',
      icon: IconStepSchedule,
      hasNavigation: true,
    },
    payment: {
      idx: 2,
      title: 'Payment',
      subtitle: 'Enter your payment details to make the payment and to confirm session.',
      icon: IconStepPayment,
      hasNavigation: true,
    },
    paymentConfirmed: {
      idx: 3,
      title: 'Confirmation',
      subtitle: '',
      icon: IconStepPaymentConfirmed,
    },
  };
  let currentStep = steps.payment; // $booking.coachGame ? steps.addBookings : steps.game;
  let needsLogin = false;

  $: isBookingForTeam = isTeamManager && selectedTeam;

  // Get the correct button text depending on what's going on:
  let continueButtonText = 'Continue',
    continueDisabled = false;
  $: {
    switch (currentStep.idx) {
      case steps.addBookings.idx:
        continueDisabled = false;
        if (!isShowingTeamSelector && $booking.liveBookings.length === 0) {
          continueButtonText = "I'll do it later";
          // If they're buying a single session, don't allow them to schedule later.
          continueDisabled = $booking.pack.quantity === 1;
        } else {
          continueButtonText = 'Continue';
        }
        break;
      case steps.payment.idx:
        // TODO: Hook-up:
        continueButtonText = false && !$account.data.session.discord ? 'Continue' : `Pay $${TOTAL_AMOUNT}`;
        continueDisabled = (false && !$account.data.session.discord) || needsLogin;
        break;
    }
  }

  const coachedGames = ($response.data?.coachProfile?.coachPackages ?? []).reduce((prev, curr) => {
    if (!prev.includes(curr.game.title['en'])) {
      prev.push(curr.game.title['en']);
    }
    return prev;
  }, []);

  let embedDescription;
  if (coachedGames.length > 0) {
    embedDescription = `${$response.data?.coachProfile?.name} - ${coachedGames.slice(0, 2).join(' & ').trim()} coach`;
  }

  // If we have previous booking state then restore it and move back to payment page.
  // BookingState is only set when going off-site to connect a Discord account.
  const bookingState = BookingState.get();
  if (Object.keys(bookingState).length > 0) {
    $booking = { ...bookingState };
    currentStep = steps.payment;
  }
  BookingState.clear();

  function handleContinue() {
    switch (currentStep.idx) {
      case steps.addBookings.idx:
        if (isShowingTeamSelector) {
          isShowingTeamSelector = false;
          return;
        }

        needsLogin = !isAuthenticated($account);

        if (isShowingGameQuestions) {
          if (questionsAndAnswers.some(qa => qa.answer === '')) {
            return Toasts.push({
              kind: 'error',
              placement: 'center',
              content: 'You need to answer all questions before continuing.',
            });
          }

          currentStep = steps.payment;
          return;
        }

        // Team managers answer questions for each player when adding a session, so they
        // don't need to see the questions screen.
        // Also skip the questions screen if they're buying a multipack and have decided not to select any sessions.
        if (isBookingForTeam || $booking.liveBookings.length === 0) {
          currentStep = steps.payment;
        } else {
          isShowingGameQuestions = true;
        }
        break;
      case steps.payment.idx:
        currentStep = steps.paymentConfirmed;
        break;
    }
  }

  async function goBack() {
    if (currentStep.idx === steps.game.idx) {
      await Sapper.goto(`/@${$response.data.coachProfile.slug}`);
    }
    if (currentStep.idx === steps.addBookings.idx) {
      if (isShowingGameQuestions) {
        // When viewing the game questions, make sure the back button lets us go back to the bookings screen.
        questionsAndAnswers.forEach(qa => (qa.answer = ''));
        isShowingGameQuestions = false;
      } else if (isTeamManager && !isShowingTeamSelector) {
        // If team manager, make sure the back button lets them go back to the team selection screen.
        isShowingTeamSelector = true;
      } else {
        currentStep = steps.game;
      }
      return;
    }
    // Go back one step.
    currentStep = Object.values(steps).find(s => s.idx === currentStep.idx - 1);
  }

  onMount(() => {
    if (window.amplitude) {
      window.amplitude.getInstance().logEvent('Started Booking Flow');
      if ($booking.coachGame && currentStep !== steps.payment) {
        window.amplitude.getInstance().logEvent('Selected CoachGame', {
          coachGameId: $booking.coachGame.id,
          gameTitle: $booking.coachGame.game.title['en'],
        });
      }
    }
  });
  onDestroy(() => {
    booking.set({});
  });
</script>

<svelte:head>
  <!-- Primary Meta -->
  <title>{$response.data ? `Book a time with ${$response.data.coachProfile.name} on Metafy` : 'Metafy'}</title>
  <meta name="description" content={embedDescription ?? 'Start winning more.'} />
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content={$response.data ? `https://metafy.gg/@${$response.data.coachProfile.name}` : 'https://metafy.gg'}
  />
  <meta
    property="og:title"
    content={$response.data ? `Book a time with ${$response.data.coachProfile.name} on Metafy` : 'Metafy'}
  />
  <meta property="og:description" content={embedDescription ?? 'Start winning more.'} />
  <meta
    property="og:image"
    content={$response.data?.coachProfile?.account?.avatar?.large || 'https://static.metafy.gg/metafy_symbol.png'}
  />
  <!-- Twitter -->
  <meta property="twitter:card" content="summary" />
  <meta
    property="twitter:url"
    content={$response.data ? `https://metafy.gg/@${$response.data.coachProfile.name}` : 'https://metafy.gg'}
  />
  <meta
    property="twitter:title"
    content={$response.data ? `Book a time with ${$response.data.coachProfile.name} on Metafy` : 'Metafy'}
  />
  <meta property="twitter:description" content={embedDescription ?? 'Start winning more.'} />
  <meta
    property="twitter:image"
    content={$response.data?.coachProfile?.account?.avatar?.large ?? 'https://static.metafy.gg/metafy_symbol.png'}
  />
</svelte:head>

{#if $response.loading}
  <!-- prettier-ignore -->
  <!-- TODO: Loading  -->
{:else if $response.error}
  <!-- prettier-ignore -->
  <!-- TODO: Error -->
{:else}
  <div class="flex h-full">
    <BookingSidebar coachProfile={COACH_PROFILE} {steps} {currentStep} />

    <main class="overflow-hidden flex flex-col w-full">
      <div class="container relative flex flex-col h-full xl:px-24 pt-5 md:pt-8 xl:pt-14 pb-6">
        {#if currentStep.idx === steps.game.idx}
          <div
            in:fly={{ x: 100, duration: 500, delay: 500 }}
            out:fly={{ x: -100, duration: 500 }}
            class="flex flex-col h-full"
          >
            <h1 class="hidden md:block font-medium text-1.5xl text-white leading-none mb-3">{currentStep.title}</h1>
            <p class="text-sm text-neutrals-l40 leading-normal mb-5 xl:mb-8">{currentStep.subtitle}</p>
            <CoachGames
              coachProfile={COACH_PROFILE}
              hasSeparator={false}
              on:click={({ detail }) => {
                // TODO: Hook-up: Make sure the info we're logging is up to date.
                if (window.amplitude) {
                  window.amplitude
                    .getInstance()
                    .logEvent('Selected CoachGame', { coachGameId: detail.id, gameTitle: detail.game.title['en'] });
                }

                isAddingLiveBookings = detail.type === 'live';
                $booking.coachGame = detail.coachGame;
                $booking.pack = detail.pack;
                // When they select a new game/pack, we need to reset all the currently added bookings.
                $booking.liveBookings = [];
                $booking.replayBookings = [];

                currentStep = steps.addBookings;
              }}
            />
          </div>
        {:else if currentStep.idx === steps.addBookings.idx}
          <div
            in:fly={{ x: 100, duration: 500, delay: 500 }}
            out:fly={{ x: -100, duration: 500 }}
            class="flex flex-col h-full"
          >
            {#if isShowingTeamSelector}
              <h1 class="font-medium text-xl md:text-1.5xl text-white leading-none xl:mt-32 mb-3">Choose Team</h1>
              <p class="xl:w-1/2 text-sm text-neutrals-l40 leading-normal mb-5 xl:mb-10">
                Select the team you would like to make this booking for, or choose yourself if you’re booking for you.
              </p>

              <TeamSelector
                managerAccount={MANAGER_ACCOUNT}
                teamMemberships={TEAM_MEMBERSHIPS}
                bind:selectedTeam
                on:selected={() => {
                  // When they select a new team, we need to reset all the currently added bookings.
                  $booking.liveBookings = [];
                  $booking.replayBookings = [];
                }}
              />
            {:else}
              <div class="flex">
                <div class="flex flex-col">
                  <h1 class="hidden md:block font-medium text-1.5xl text-white leading-none mb-3">
                    {currentStep.title}
                  </h1>
                  <p class="text-sm text-neutrals-l40 leading-normal mb-5 xl:mb-8">{currentStep.subtitle}</p>
                </div>
                {#if isBookingForTeam}
                  <img
                    class="team-avatar hidden md:block object-cover rounded-lg ml-auto"
                    src={selectedTeam.avatar}
                    alt={selectedTeam.name}
                  />
                {/if}
              </div>

              <BookingStatus
                coachGame={$booking.coachGame}
                pack={$booking.pack}
                numBookingsScheduled={$booking.liveBookings.length}
                on:back={() => {
                  isShowingGameQuestions = false;
                  goBack();
                  if (isTeamManager) {
                    goBack();
                  }
                }}
              />

              {#if isShowingGameQuestions}
                <div class="flex">
                  <div class="w-full md:w-2/3 space-y-8 mt-14 md:mr-24">
                    {#each questionsAndAnswers as qa}
                      <div>
                        <FormControl
                          type="textarea"
                          class="bg-neutrals-d10 bg-opacity-80"
                          label={qa.question}
                          rows={3}
                          value={qa.answer}
                          on:input={event => {
                            qa.answer = event.target.value;
                          }}
                        />
                      </div>
                    {/each}
                  </div>
                  <div class="hidden md:flex flex-col w-1/4 2xl:w-1/5 mt-14 mr-4">
                    <span
                      class="self-start uppercase text-xs font-medium text-functional-b10 border border-functional-b10 rounded-md leading-none tracking-0.08 py-1 px-2 mb-3">
                      Tip
                    </span>
                    <p class="text-sm text-neutrals-l40 text-opacity-65 leading-normal mb-8">
                      Answer these questions set by the coach to get to know you better before session starts.
                    </p>
                    <img src="/DELETE_ME/booking/paper_airplanes.png" alt="Answer these questions!" />
                  </div>
                </div>
              {:else if isAddingLiveBookings}
                <AddLiveBookings
                  availability={AVAILABILITY}
                  {isBookingForTeam}
                  memberships={isBookingForTeam &&
                    TEAM_MEMBERSHIPS.find(tm => tm.team.id === selectedTeam.id).team.memberships}
                  {questionsAndAnswers}
                  on:continue={handleContinue}
                  on:back={goBack}
                />

                {#if isBookingForTeam}
                  <p class="text-sm text-right text-neutrals-l40 leading-normal ml-auto mt-auto">
                    Your remaining hours can be used to schedule sessions for this team later.
                  </p>
                {/if}
              {:else}
                replay
              {/if}
            {/if}
          </div>
        {:else if currentStep.idx === steps.payment.idx}
          <LoginCreateModal
            isVisible={needsLogin}
            on:close={() => {
              if (needsLogin) {
                goBack();
              }
            }}
            on:after={() => (needsLogin = false)}
          />

          <!-- FIXME: Don't have another Discord account I can connect, remove this: -->
          {#if !$account.data.session.discord}
            <ConnectDiscord coachName={COACH_PROFILE.name} />
          {:else}
            <Payment coach={COACH_PROFILE} {isBookingForTeam} />
          {/if}
        {:else if currentStep.idx === steps.paymentConfirmed.idx}
          <BookingConfirmed coachName={COACH_PROFILE.name} />
        {/if}
      </div>
      {#if currentStep.hasNavigation}
        <NavigationBar {continueButtonText} {continueDisabled} on:back={goBack} on:continue={handleContinue} />
      {/if}
    </main>
  </div>
{/if}

<style>
  :global(.guest-navbar) {
    display: none;
  }

  .team-avatar {
    width: 44px;
    height: 44px;
  }
</style>
