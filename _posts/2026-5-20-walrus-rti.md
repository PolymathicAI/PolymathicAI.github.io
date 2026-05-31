---
layout: post
title: "Emergent Transfer of a Physics Foundation Model: From Simulation to Laboratory Turbulence"
authors: Payel Mukhopadhyay, Stefan Nixon, Romain Watteaux, Alberto Bietti, Kyunghyun Cho, Cristiana Diaconu, Irina Espejo Morales, David Fouhey, Siavash Golkar, Tom Hehir, Shirley Ho, Jake Kovalic, Géraud Krawezik, François Lanusse, Tanya Marwah, Michael McCabe, Rudy Morel, Mariel Pettee, Helen Qu, Jeff Shen, Hadi Sotoudeh, Stuart Dalziel, Miles Cranmer
shorttitle: "A Physics Foundation Model Bridges Simulation and Laboratory Turbulence"
date: 2026-05-21
smallimage: walrus-rti/rti-alpha-comparison.png
image: walrus-rti/rti-alpha-comparison.png
blurb: Can a physics foundation model finetuned only on idealized simulation transfer to real laboratory experiments it was never trained on? We test this on Rayleigh-Taylor instability, where simulation and experiment have disagreed on the mixing growth rate for decades, and show that Walrus crosses the divide zero-shot, entering the experimentally observed growth band and shedding independent light on a longstanding debate.
shortblurb: A physics foundation model finetuned on idealized simulations transfers zero-shot to laboratory turbulence, crossing a decades-old sim-experiment gap in the mixing growth rate.
splashimage: /images/blog/walrus-rti/rti-summary.png
link: https://arxiv.org/abs/TBD
permalink: /blog/walrus-rti/
---

Foundation models are increasingly being applied to the physical sciences, but whether they can be usefully deployed on real laboratory experiments remains an open question. We test this on **Rayleigh-Taylor instability (RTI)**, one of the most enduring challenges in fluid dynamics. RTI drives some of the most consequential mixing processes in the Universe, from inertial confinement fusion to supernova explosions to ocean mixing. Standard ML models struggle with it, and despite more than a century of work it carries a stubborn, unresolved discrepancy between simulation and experiment: the late-time mixing growth rate coefficient α measured in most laboratory experiments sits near 0.06-0.07, roughly three times the value from idealized direct numerical simulations which give an α between 0.02-0.03. The origin of this gap is still debated. That makes RTI a stringent test for a question that matters well beyond RTI itself: can foundation models finetuned on idealized simulations generalise to sparse, complex and noisy settings of laboratory data where they were never trained on? The sim-experiment gap in α is a precise, quantitative measure of whether that generalisation has succeeded.

We finetune **Walrus**, a foundation model pretrained on a broad corpus of continuum dynamics simulations, on just one to three **direct numerical simulation (DNS)** realizations of RTI, with no physics-informed loss. The finetuned model recovers canonical RTI diagnostics over full autoregressive rollouts. Applied zero-shot to initial conditions from real sliding-barrier laboratory experiments, with no experimental training data at any stage, its predicted late-time growth rate rises into the experimentally observed band. The result provides independent, data-driven evidence on a decades-long unresolved debate in the RTI community.

<p align="center">
  <img src="/images/blog/walrus-rti/rti-summary.png" alt="Overview figure: (A) finetuning Walrus on DNS and evaluating on held-out simulations, (B) zero-shot transfer to sliding-barrier laboratory experiments, (C) zero-shot transfer to stably stratified RTI" width="90%">
  <br>
  <em><strong>(A)</strong> Walrus finetuned on a small number of 3D RTI DNS realizations, evaluated on independent held-out simulations. <strong>(B)</strong> Zero-shot transfer to sliding-barrier experiments: Walrus enters the experimentally observed late-time growth band without any experimental training data. <strong>(C)</strong> Zero-shot transfer to stratified RTI: finetuned only on unstratified DNS, Walrus responds correctly to stable background stratification.</em>
</p>

---

## Why RTI is the right test case
<br/>

Place a heavy fluid above a light one in a gravitational field, and the interface erupts into complexity. Fingers plunge, bubbles rise, and small perturbations grow into chaotic, multiscale mixing. RTI is hard for machine learning because this chaos does not just make individual trajectories difficult to predict; it exposes a deeper simulation-to-laboratory gap. In the late-time, approximately self-similar regime, the bulk mixing width follows `h(t) ∼ α A_t g t²`, where `A_t` is the Atwood number, `g` is the acceleration, and `α` is the dimensionless growth coefficient that measures how fast the layer grows. This late-time regime is the comparison that matters: idealized DNS usually settles near `α ≈ 0.02-0.03`, while most laboratory experiments reach `α ≈ 0.06-0.07`. Because the model is finetuned only on idealized DNS, it has only seen the low-α regime during training. Entering the higher experimental α band from experimental input frames is therefore the nontrivial test. If the same DNS-specialized model gives DNS-like growth from DNS frames but enters the experimental growth band from experimental frames at zero shot, then the input initial frames alone have moved it across the sim-to-real divide. That is the central transfer test in the paper.

---

## Emulation: learning RTI physics from very little data
<br/>
<p align="center">
  <img src="/images/blog/walrus-rti/rti-morphology-comparison.png" alt="Comparison of DNS and Walrus rollout showing RTI bubble morphology and mixing layer development" width="90%">
  <br>
  <em>Four representative times comparing DNS (top) and Walrus (bottom) on a held-out test realization. The model tracks mixed-layer growth and preserves dominant plume structures through the nonlinear and turbulent stages.</em>
</p>

Walrus is pretrained on a broad corpus of continuum dynamics simulations with RTI explicitly excluded, so RTI physics must be learned entirely through finetuning. We finetune on between one and three 3D DNS realizations, with no physics-informed loss. Whatever physical structure appears in the rollouts emerges from the data alone.

<p align="center">
  <img src="/images/blog/walrus-rti/rti-alpha-comparison.png" alt="Mixing layer height h(t) and growth rate coefficient alpha(t) comparing DNS and Walrus rollout" width="90%">
  <br>
  <em>Mixing-layer height h(t) (left) and growth rate coefficient α(t) (right) on a held-out test realization. Walrus tracks the DNS closely through the full rollout, settling near α ≈ 0.02 in the self-similar regime.</em>
</p>

<p align="center">
  <img src="/images/blog/walrus-rti/rti-spectra-alpha.png" alt="Kinetic energy spectra comparing DNS and Walrus rollout" width="65%">
  <br>
  <em>Kinetic energy spectra in the self-similar regime. Walrus matches the DNS shape and amplitude across the inertial range.</em>
</p>

On held-out test realizations, the finetuned model recovers the canonical diagnostics simultaneously. Bubble morphology and mixed-layer growth track the DNS through the onset of turbulence. The kinetic energy spectrum matches across the inertial range. The global energy budget is reproduced over the full rollout. Conventional surrogate models typically diverge within a handful of autoregressive steps, so sustaining all three over long rollouts is a genuine test of whether the model has encoded physical structure rather than memorized specific trajectories.

Finetuning on a single DNS realization already gets close; adding a second or third tightens agreement only incrementally. The broad fluid prior means only a few examples are needed to specialize.

---

## Sim-to-real: zero-shot transfer to the laboratory
<br/>

<p align="center">
  <img src="/images/blog/walrus-rti/rti-exp-setup.png" alt="Sliding-barrier experimental apparatus at the GK Batchelor Laboratory" width="70%">
  <br>
  <em>The sliding-barrier apparatus at the GK Batchelor Laboratory, Cambridge. Two fluid layers of differing density are separated by a polycarbonate barrier. At release, the interface is seeded with large-scale perturbation structure driven by barrier motion, structural vibration, and molecular diffusion.</em>
</p>

The sim-experiment gap in α has a leading candidate explanation: initial conditions. DNS uses idealized short-wavelength perturbations at the interface. Laboratory flows carry large-scale structure set by the barrier release, driven by apparatus motion, vibration, and molecular diffusion, which is notoriously difficult to parametrize numerically. The two initial interfaces look nothing alike.

<p align="center">
  <img src="/images/blog/walrus-rti/rti-initial-conditions.png" alt="Initial conditions comparison: DNS interface versus experimental interface" width="80%">
  <br>
  <em>Initial concentration fields for a DNS realization (left) and a sliding-barrier experimental sample (right). The DNS interface carries short-wavelength perturbations; the experimental interface carries large-scale structure set by the barrier release. This difference is the leading candidate explanation for the factor-of-three gap in α.</em>
</p>

We finetune Walrus on 2D slices from a single DNS realization, then apply it directly to initial conditions from six sliding-barrier laboratory experiments with no experimental training data at any stage.

<p align="center">
  <img src="/images/blog/walrus-rti/rti-exp-plots.png" alt="Late-time growth rate coefficient alpha on held-out laboratory experiments: zero-shot (left) and experimentally finetuned (right)" width="75%">
  <br>
  <em>Growth rate coefficient α(t) on held-out laboratory experiments. Left: zero-shot, no experimental training data. Right: after light finetuning on two experimental samples. In both cases Walrus enters the experimentally observed late-time growth band.</em>
</p>

The DNS-specialized model, given experimental initial frames, rises into the experimentally observed self-similar band at late times. The same model given DNS frames settles near α ≈ 0.02. The only difference between the two rollouts is the input.

What this reveals about the learned representation matters more than the number itself. Self-similar RTI growth is governed by h(t) ∼ α A<sub>t</sub> g t², and α depends on how the flow was seeded. The model was trained exclusively on DNS with short-wavelength initial conditions and low α. Given experimental frames carrying large-scale initial structure, it produces a higher late-time α, in the physically correct direction. The model has encoded the dependence of self-similar growth on initial condition structure, general enough to carry from the DNS-like regime to the laboratory.

That this happens from experimental initial frames alone supports the view that initial conditions drive a substantial part of the sim-experiment discrepancy in α. It is independent, data-driven evidence on a debate that has resisted resolution through simulation alone.

The shift is robust across different amounts of input context. With just two experimental samples, a lightweight finetuning stage further improves agreement through the early transient, while the late-time α already reached zero-shot is preserved.

---

## Zero-shot transfer to new physical regime: stable stratification
<br/>
<p align="center">
  <img src="/images/blog/walrus-rti/rti-stratified-profiles.png" alt="Horizontally averaged concentration profiles for stratified DNS reference and Walrus zero-shot rollout" width="85%">
  <br>
  <em>Mean concentration profiles for the stratified DNS reference (b) and the corresponding zero-shot Walrus rollout (c), finetuned only on unstratified RTI. Stable stratification confines mixing near the midplane; Walrus captures this without ever seeing stratified flows during training.</em>
</p>

The experimental result crosses the simulation-to-real divide. But sim-to-real transfer alone does not tell us whether the model has learned RTI as a broader buoyancy-driven phenomenon, or only the unstratified dynamics it saw during finetuning. To ask that question, we need to change the physics in a controlled way: keep the problem in the RTI family, but alter how buoyancy acts on the mixing layer.

We test this by applying the DNS-finetuned model to **stably stratified RTI**, a regime where a stable background density gradient acts as a restoring force, suppressing vertical spreading and confining the mixing layer near the midplane. This regime was entirely absent from finetuning.

In unstratified RTI, buoyancy drives the mixing layer to spread indefinitely. In stably stratified RTI, it arrests that spreading. A model that had only pattern-matched unstratified DNS trajectories would keep spreading. Walrus confines the mixing layer, matching the qualitative behavior of the stratified DNS reference over rollouts extending well beyond the training horizon. The discrepancy is one of degree rather than kind: the model predicts slightly stronger spreading at late times, but the physical response to stratification is correct.

The learned representation carries something about how buoyancy governs mixing, not unstratified RTI as a specific flow pattern, but the underlying physics that makes RTI respond differently when the buoyancy balance changes.

---

## What this means
<br/>

RTI is a worst case. It is chaotic and multiscale, standard ML architectures fail on it, and it carries a well-quantified simulation-experiment discrepancy that has persisted for decades. A foundation model finetuned on a handful of idealized simulations transfers zero-shot to real laboratory data, sheds independent light on that debate, and responds correctly to a physical regime it was never shown.

Prior attempts to close the sim-experiment gap for RTI each required a bespoke numerical setup tailored to the specific experimental apparatus. Here, only a few experimental samples and a lightweight finetuning stage suffice.

The question of how the model achieves this transfer remains open. Until we understand that, its inferences remain, in a useful sense, a fiction. Traditional simulations and the Navier-Stokes equations are themselves fictions: approximations of true physics, just as experimental measurements are only approximate representations of the underlying flow. The question is whether foundation models offer new, useful fictions despite relying on imperfect training data. Our results suggest they do.

---

### Open source resources
<br/>
Materials:
* **Paper:** [Emergent Transfer of a Physics Foundation Model: From Simulation to Laboratory Turbulence](https://arxiv.org/abs/TBD)

*-- Payel Mukhopadhyay, Stefan Nixon, Romain Watteaux, Alberto Bietti, Kyunghyun Cho, Cristiana Diaconu, Irina Espejo Morales, David Fouhey, Siavash Golkar, Tom Hehir, Shirley Ho, Jake Kovalic, Géraud Krawezik, François Lanusse, Tanya Marwah, Michael McCabe, Rudy Morel, Mariel Pettee, Helen Qu, Jeff Shen, Hadi Sotoudeh, Stuart Dalziel, Miles Cranmer*

---
**Acknowledgements**

We would like to acknowledge the support of Schmidt Sciences and the Simons Foundation. This work was supported in part by the AI2050 program at Schmidt Sciences (Grant G-25-70028). Dr. Mukhopadhyay thanks the Infosys-Cambridge AI centre for support. Additionally, computations were run at facilities supported by the Scientific Computing Core at the Flatiron Institute. The Flatiron Institute is a division of the Simons Foundation. The authors thank Lucy Reading-Ikkanda for assistance with figures. Miles Cranmer is grateful for support from the Schmidt Sciences AI2050 Early Career Fellowship and the Isaac Newton Trust. S.S. Nixon and R. Watteaux thank the CEA's Centre de Calcul Recherche et Technologie for facilitating DNS computations. S. S. Nixon gratefully acknowledges CEA for funding his PhD research and thanks the technical staff at the G. K. Batchelor Laboratory (DAMTP, University of Cambridge) for their invaluable assistance in completing the experiments.