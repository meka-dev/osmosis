(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{459:function(e,t,a){"use strict";a.r(t);var o=a(8),r=Object(o.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"generalized-f1-for-lockups"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#generalized-f1-for-lockups"}},[e._v("#")]),e._v(" Generalized F1 for lockups")]),e._v(" "),a("h2",{attrs:{id:"goal"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#goal"}},[e._v("#")]),e._v(" Goal")]),e._v(" "),a("p",[e._v("We want the goal of being able to distribute LP rewards every epoch, without the distribution having to iterate over every single user.\nEvery pool allows users to bond LP shares, for a time T.\nThere are different rewards given to users depending on how long they have bonded their LP shares.\nFor instance, if they have bonded for 7 days, they get more rewards than if they bond for 1 day.\nFurther, we must prevent the chain and users from being exposed to DOS vectors in this process.")]),e._v(" "),a("h2",{attrs:{id:"desired-general-method-of-doing-so"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#desired-general-method-of-doing-so"}},[e._v("#")]),e._v(" Desired general method of doing so")]),e._v(" "),a("p",[e._v("The F1 Fee Distribution idea ( https://drops.dagstuhl.de/opus/volltexte/2020/11974/pdf/OASIcs-Tokenomics-2019-10.pdf ) is basically, if rewards are to be linearly distributed to folks by share-ownership, then there is a straightforward solution using 'accumulators' to store the rewards.")]),e._v(" "),a("p",[e._v("The rough idea is as follows:\nWe want to track the rewards a user who starts owning 5 shares of something at time A, and withdraws rewards for those 5 shares at a later time B.\nThe way we do this is by storing an accumulator of all the rewards a single share would have gotten at time = 0, until now.\nSo when the user starts owning 5 shares of that something at time A, we create a state record to persist the accumulator for all rewards' a single share gets from t=0 to t=A. (Called "),a("code",[e._v("accum_A")]),e._v(")\nWhen they go to withdraw at t=B, we read the accumulator's value at time t=B. (Called "),a("code",[e._v("accum_B")]),e._v(")\nWe compute the rewards per share then as "),a("code",[e._v("Rewards_per_share = accum_B - accum_A")]),e._v(".\nTherefore the total rewards here is "),a("code",[e._v("total_rewards = Rewards_per_share * num_shares")]),e._v(".")]),e._v(" "),a("p",[e._v("This has been built out before in the cosmos SDK, check out the distribution module!")]),e._v(" "),a("p",[e._v("https://github.com/cosmos/cosmos-sdk/tree/master/x/distribution/spec")]),e._v(" "),a("h2",{attrs:{id:"more-details-on-design"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#more-details-on-design"}},[e._v("#")]),e._v(" More details on design")]),e._v(" "),a("p",[e._v("In our case, we want a similar architecture to whats implemented in staking, but with some optimizations.")]),e._v(" "),a("h4",{attrs:{id:"fewer-periods"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#fewer-periods"}},[e._v("#")]),e._v(" Fewer Periods")]),e._v(" "),a("p",[e._v("We only need to update total share amounts right before each epoch begins, in the "),a("code",[e._v("BeforeEpochStart")]),e._v(" hook. (each update is called a "),a("code",[e._v("period")]),e._v(" in the cosmos SDK & F1 spec)\nThis is as opposed to staking, where it must be done on every bond and unbond.\nThis is because LP rewards only get sent at the epoch boundary, so the difference in accumulator values between each intermittent step is 0.")]),e._v(" "),a("p",[e._v("This also lowers the priority of implementing the refcount optimization present in the cosmos SDK, if that is a bottleneck here.")]),e._v(" "),a("h4",{attrs:{id:"how-to-handle-variable-lockup-lengths"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#how-to-handle-variable-lockup-lengths"}},[e._v("#")]),e._v(" How to handle variable lockup lengths")]),e._v(" "),a("p",[e._v("Every bond should store when rewards for it were last withdrawn.")]),e._v(" "),a("p",[e._v("Using the "),a("a",{attrs:{href:"https://github.com/osmosis-labs/osmosis/blob/main/store/README.md",target:"_blank",rel:"noopener noreferrer"}},[e._v("accumulation store"),a("OutboundLink")],1),e._v(" implemented, we efficiently can know how many tokens have bonded for a duration greater than length "),a("code",[e._v("T")]),e._v(".")]),e._v(" "),a("p",[e._v("To avoid DOS issues / simplify lots of complexity, we restrict how many different durations users can be rewarded for locking up for. E.g. your only conditions you can reward for are, e.g. "),a("code",[e._v("bonding >= 1 day, bonding >= 7 day, bonding >= 14 day, bonding >= 1 month")]),e._v(". (And no in between durations)\nThe supported durations are found in [this](TBD, get link to code) state variable.")]),e._v(" "),a("p",[e._v("Per denomination we are rewarding lock-ups for, we store one accumulator value per bonding duration. So there is one accumulator for each (lockable denom, supported reward duration) pair.")]),e._v(" "),a("p",[e._v("Then at epoch time, when adding rewards for "),a("code",[e._v("1 day")]),e._v(" bonds, the code finds the number of tokens that are bonded for > 1 day, by looking at the accumulation store.\nThen we just increment the accumulator for 1 day bond rewards of that denomination accordingly. (Increment it by "),a("code",[e._v("(LP rewards for > 1 day) / (number of tokens bonded for > 1 day)")]),e._v(")")]),e._v(" "),a("p",[e._v("These rewards for "),a("code",[e._v("> 1 day")]),e._v(" duration only get added to "),a("code",[e._v("> 1 day")]),e._v(" accumulator, not the other accumulators. People who have locked longer get all the rewards using the method described in the next section, claiming rewards.")]),e._v(" "),a("h4",{attrs:{id:"claiming-rewards"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#claiming-rewards"}},[e._v("#")]),e._v(" Claiming rewards")]),e._v(" "),a("p",[e._v("This should be done as in staking. In state, there is a record associated with what accumulator value that my unclaimed rewards begin at.")]),e._v(" "),a("p",[e._v("If I have a lockup for say "),a("code",[e._v("10 days")]),e._v(", last claimed rewards at t=A, then I get total rewards at time "),a("code",[e._v("t=B")]),e._v(" according to:")]),e._v(" "),a("p",[a("code",[e._v("rewards_per_share = (accum_1_day_B - accum_1_day_A) + (accum_7_day_B - accum_7_day_A)")])]),e._v(" "),a("p",[a("code",[e._v("total_rewards = (my number of tokens locked) * rewards_per_share")])]),e._v(" "),a("p",[e._v("In practice, folks may have different numbers of tokens locked for "),a("code",[e._v(">1 day")]),e._v(" and "),a("code",[e._v(">7 day")]),e._v(" which would then be handled by taking a linear combination of the terms.\nWe can enforce that for a single pool's LP rewards, all your lockups must get their rewards withdrawn together though.\nAnd every further bonding must withdraw existing rewards")]),e._v(" "),a("h4",{attrs:{id:"handling-unbonding-lp-shares"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#handling-unbonding-lp-shares"}},[e._v("#")]),e._v(" Handling unbonding LP shares")]),e._v(" "),a("p",[e._v("If I am unbonding a 14 day LP share bond, I should still be getting the rewards for a 7 day LP shares for 6 days, until I am no longer bonded for a full 7 days remaining.")]),e._v(" "),a("p",[e._v("This means we need to define a 'symmetry' set for every unbonding duration.\nWe should truncate this to a precision of the epoch you complete your unbond during.\nSo what we do is when you start unbonding, we create an accumulation store for folks whose unbond is ending during {epoch N}.\nThen when we distribute rewards at an epoch boundary, we can uniformly treat everyone whose unbond ends within that epoch the same way, efficiently.")]),e._v(" "),a("p",[e._v("Also, when beginning to unbond, we do as we do in staking, and withdraw rewards for those tokens immediately for simplicity.")]),e._v(" "),a("h3",{attrs:{id:"dos-vectors-to-be-concerned-about"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dos-vectors-to-be-concerned-about"}},[e._v("#")]),e._v(" DOS vectors to be concerned about")]),e._v(" "),a("ul",[a("li",[e._v("too many options for what bond durations to reward for\n"),a("ul",[a("li",[e._v("We handle this by limiting the number of different bond lengths you can get rewarded.")])])])])])}),[],!1,null,null,null);t.default=r.exports}}]);