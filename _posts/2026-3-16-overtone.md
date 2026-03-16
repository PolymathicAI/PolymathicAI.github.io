---
layout: post
title: "Overtone: Flexible and Cleaner Physics Emulators with Cyclic Patch Modulation"
authors: Payel Mukhopadhyay, Michael McCabe, Ruben Ohana, Miles Cranmer
shorttitle: "Overtone: Flexible and Cleaner Physics Emulators"
date: 2026-01-15 11:00
smallimage: overtone/modulator-diagram-02.png
image: overtone/modulator-diagram-02.png
blurb: Overtone introduces compute-flexible tokenization for transformer-based PDE surrogates, enabling a single model to trade speed for accuracy at inference time while also reducing long-rollout patch artifacts through cyclic patch modulation.
shortblurb: A single PDE transformer can now adapt its inference compute budget on demand while producing cleaner long rollouts.
splashimage: /images/blog/overtone/modulator-diagram-02.png
link: https://openreview.net/pdf?id=itUo64aUeK
github_link: https://github.com/payelmuk150/patch-modulator
permalink: /blog/overtone/
---

Transformer-based PDE surrogates are becoming increasingly powerful, but they still inherit a critical limitation from vision models: they usually rely on a **fixed patch size**. That means a model is typically trained and deployed at one tokenization scale, with little room to adapt if the user later wants higher fidelity, lower compute cost, or better long-rollout behavior. In our new paper, we introduce **Overtone**, a framework that makes patch-based physics emulators far more flexible at inference time. A single trained model can now be run at different patch or stride settings depending on the available compute budget, allowing users to dynamically trade off speed and accuracy without retraining. At the same time, we show that **cyclically changing the patching pattern during autoregressive rollout** produces a second major benefit: it suppresses the structured harmonic artifacts that often accumulate in fixed-patch models over long horizons. Across challenging 2D and 3D PDE benchmarks, Overtone delivers both **practical compute-adaptive deployment** and **cleaner, more stable long rollouts**.

---

## Why fixed patching is limiting
<br/>

Patch-based tokenization is one of the main reasons transformer surrogates are practical for spatiotemporal physics. By grouping pixels or grid cells into patches, the model reduces the number of tokens and therefore the cost of attention. But this design choice comes with two important drawbacks.

First, **fixed patching makes inference compute inflexible**. If a user wants a faster prediction, or instead wants to spend more compute to get higher fidelity, that typically requires training and maintaining multiple separate models at different patch sizes. This is especially undesirable as PDE surrogates and foundation models continue to grow larger and more expensive to train.

Second, **fixed patching can create structured long-horizon errors**. In autoregressive rollouts, repeatedly using the same patch grid means that discretization errors can appear at the same patch-lattice frequencies step after step. Over time, these errors accumulate coherently, producing spectral spikes and visible grid-like artifacts in the predicted fields.

Overtone is designed to address both of these issues together: it makes tokenization **controllable at inference time**, and it uses that control to improve long-rollout stability.

---

## What Overtone changes
<br/>
<p align="center">
  <img src="/images/blog/overtone/modulator-diagram-02.png" alt="Overtone overview with flexible tokenization and cyclic rollout schedules" width="70%">
</p>

Overtone introduces two architecture-agnostic modules for patch-based PDE transformers:

- **Convolutional Stride Modulation (CSM):** keeps the convolutional kernel fixed, but changes the stride dynamically.
- **Convolutional Kernel Modulation (CKM):** dynamically resizes the convolutional kernel itself, allowing the effective patch size to change across forward passes.

Both methods let a single trained model operate at multiple tokenization scales at inference. In practice, this means a user can run the same model with smaller patches for higher accuracy, or larger patches for lower compute cost, depending on the application.

This flexibility also enables something that ordinary fixed-patch surrogates simply cannot do: **inference-time rollout schedules**. Instead of using one patch size forever, Overtone can cycle through several, for example:

**4 → 8 → 16 → 4 → 8 → 16**

This schedule turns tokenization into an inference-time control knob. It does not just change cost — it also changes how rollout errors accumulate.

---

## Compute flexibility: one model, multiple deployment budgets
<br/>

A central motivation for Overtone is practical deployment. In many scientific settings, the available compute at inference time is not fixed in advance. Sometimes users want the best possible accuracy. Sometimes they need a faster forecast. Sometimes they want to probe several operating points quickly without retraining a new model for each one.

A practical question is how best to use a fixed training budget. One option is to spend that budget training several separate fixed-patch models, each targeting a different compute–accuracy regime. Overtone instead uses that budget to train a single flexible model that can operate across multiple tokenization settings at inference time. In our experiments, we train three fixed-patch baselines separately at patch sizes 4, 8, and 16, while training CSM and CKM once under the same total compute budget.

Overtone makes this possible with a **single model**. After training once on multiple patch or stride settings, the same model can be evaluated at different token counts, giving a direct **compute–accuracy trade-off at inference time**.

This is important because smaller patches generally improve fidelity, but also increase the cost of attention. With conventional patch-based surrogates, exploiting that trade-off requires training separate fixed-patch models from scratch. With Overtone, that trade-off becomes available on demand within one flexible model.

Across 2D and 3D PDE benchmarks from The Well, we find that a single Overtone model can **match or exceed multiple fixed-patch baselines across multiple inference-time operating points**, while eliminating the need to train and maintain separate models for each patch size.

---

## Cyclic patch modulation reduces harmonic artifacts
<br/>
<p align="center">
  <img src="/images/blog/overtone/density_averaged_power_spectrum.png" alt="Residual spectra showing harmonic artifact suppression under cyclic patch modulation" width="50%" style="mix-blend-mode: darken;">
</p>

The second major result of the paper is that flexibility in tokenization is not just useful for deployment — it also improves the predictions themselves.

When a model rolls out autoregressively using the same patch size at every step, the patch lattice remains fixed. This means the same boundary-related errors can be injected at the same spatial frequencies over and over again. We show that this leads to **harmonic artifact accumulation**: residual power concentrates at patch-related harmonics, and visible grid patterns emerge in the predicted fields.

Cyclic schedules break this coherence. By varying the patch or stride size across rollout steps, Overtone prevents those errors from repeatedly reinforcing at the same frequencies. Instead, the errors are distributed more broadly, reducing the structured buildup that causes checkerboard-like artifacts.

In practice, this leads to visibly cleaner rollouts and significantly lower long-horizon error. Across our experiments, cyclic modulation reduces 10-step rollout VRMSE by up to **30-40%** relative to conventional fixed-patch baselines.

---

## A new inference-time control knob: rollout schedules
<br/>
<p align="center">
  <img src="/images/blog/overtone/colormap_rollout_v1.png" alt="Visual comparison of rollout behavior under fixed and cyclic patch schedules" width="40%" style="mix-blend-mode: darken;">
</p>

One very exciting outcome of Overtone is that inference itself becomes more programmable. Since the model supports multiple patch or stride settings, we can ask not only *which* tokenization to use, but also *when* to use it during rollout.

We explored several inference-time rollout schedules, including simple periodic cycles, two-step dwell schedules, warm-up schedules, and random schedules. A striking finding is that the schedule choice really matters. Not all ways of varying tokenization are equally good. In our experiments, simple structured schedules like **4 → 8 → 16** often perform best, while random schedules could noticeably degrade rollout quality. We expect these trends to depend on factors such as the model architecture and the type of dataset.

This means that rollout-time tokenization becomes a genuinely new form of inference-time control in patch-based PDE surrogates. Instead of treating rollout as a fixed procedure, Overtone turns it into something that can be tuned based on accuracy targets, compute limits, or rollout horizon.

---

## Results across diverse physics systems
<br/>

We evaluated Overtone on challenging 2D and 3D datasets from **The Well**, spanning fluid dynamics, astrophysics, and active matter. These include systems such as:

- **Shear Flow**
- **Turbulent Radiative Layer 2D**
- **Rayleigh–Bénard convection**
- **Active Matter**
- **Supernova Explosion**
- **Turbulence Gravity Cooling**

Across these datasets, Overtone shows the same two recurring advantages.

First, the flexible models provide a strong and practical **compute–accuracy trade-off** at inference time, allowing one model to cover multiple deployment regimes.

Second, cyclic schedules consistently yield **cleaner and more stable rollouts** than fixed-patch baselines, with lower long-horizon error and substantially reduced patch artifacts.

We also show that the method is **architecture-agnostic**. Overtone works not only with vanilla and axial ViTs, but can also be integrated into newer hybrid architectures such as **CViT**, where it again improves performance while preserving inference-time flexibility.

---

## Why this matters
<br/>

Overtone changes the role of tokenization in PDE surrogate modeling.

Traditionally, patch size is treated as a static architectural hyperparameter chosen once during training. Our work shows that it can instead become a **dynamic inference-time control variable**. That shift has two important consequences.

First, it makes large surrogate models more practical. A single model can now serve different deployment needs without retraining, which is especially useful as foundation models for physics continue to scale up.

Second, it reveals that tokenization is not just a compute choice — it also affects the dynamics of rollout error. By changing the patching pattern over time, we can actively reduce the coherent accumulation of structured artifacts that otherwise limit long-horizon stability.

In that sense, Overtone is both an **ML methods contribution** and a **scientific modeling contribution**: it gives users finer control over inference compute while also improving the physical quality of the predictions.

---

## Looking ahead
<br/>

We think this idea extends well beyond the specific models in this paper. Any patch-based autoregressive model — in physics, video, or other spatiotemporal domains — may benefit from more flexible inference-time tokenization.

There are also many exciting next steps. Rather than using simple cyclic schedules, one could imagine **adaptive schedules** that respond to the evolving state of the rollout. More broadly, the same ideas will become particularly valuable in large pretrained multiphysics foundation models, where a single network is expected to support many downstream tasks with different fidelity and compute requirements. In fact, recent work has already demonstrated this direction at scale by incorporating **CSM** into the large multiphysics foundation model **Walrus**, where it showed strong performance across a wide range of 2D and 3D systems.

As physics foundation models become larger and more widely deployed, giving users **fine-grained control over both compute and rollout behavior** will become increasingly important. Overtone is a step in that direction.

---

### Open Source Resources
<br/>
Code and materials:
* **Paper:** [Overtone: Cyclic Patch Modulation for Clean, Efficient, and Flexible Physics Emulators](https://openreview.net/pdf?id=itUo64aUeK)
* **Code:** [GitHub](https://github.com/payelmuk150/patch-modulator)

*-- Payel Mukhopadhyay, Michael McCabe, Ruben Ohana, Miles Cranmer*

---
**Acknowledgements**

Polymathic AI gratefully acknowledges funding from the Simons Foundation and Schmidt Sciences, LLC. Payel Mukhopadhyay thanks the Infosys-Cambridge AI centre for support. We also thank the Scientific Computing Core at the Flatiron Institute for computational support, and the broader Polymathic AI team for valuable discussions and feedback.