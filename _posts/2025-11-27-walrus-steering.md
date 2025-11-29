---
layout: post
title: "Steerable Representations of Abstract Physics in Walrus" %Discovering General Physics Representations in Walrus %Does Walrus Learn Abstract Physics?
authors: Rio Alexa Fear, Payel Mukhopadhyay, Michael McCabe, Alberto Bietti, Miles Cranmer, The PolymathicAI Collaboration
shorttitle: "Steerable Representations of Abstract Physics in Walrus"
date: 2025-11-27 11:00
smallimage: physics-steering-splash.jpg
image: physics-steering-splash.jpg
blurb: Discovering that physics foundation models can learn steerable, domain-general representations of physical concepts.
shortblurb: Discovering that physics foundation models can learn steerable, domain-general representations of physical concepts.
splashimage: /images/blog/walrus_steering/paper-schematic.png
link: [https://arxiv.org/abs/2511.20798]
github_link: [https://github.com/DJ-Fear/walrus_steering]
permalink: /blog/physics-steering/
---

What if you could reach into a physics simulator’s “mind” and turn specific physical phenomena on or off — dialing up turbulence, suppressing diffusion, or even speeding up time — without changing a single parameter or retraining the model? In language models, researchers have discovered they can do exactly this through activation steering: a technique that identifies directions in a model’s internal activation space corresponding to specific concepts (like “more polite” or “more factual”), then injects those directions during inference to control behavior. But whether scientific foundation models trained purely on numerical simulations learn can also learn abstract, human-interpretable concepts has remained an open question. In a new paper we show that Walrus, a large physics foundation model from Polymathic AI, does exactly this. We find compelling evidence that Walrus learns steerable representations of physical phenomena like vorticity and diffusion that transfer across completely unrelated systems, from fluid flows to chemical reactions. The implications are exciting: these models aren’t just memorising patterns, they’re learning general physical principles that can be directly manipulated.

---

## Why interpret physics models?
<br/>
For numerical foundation models the primary focus has so far been on predictive performance rather than deep mechanistic interpretability, leading them to be seen mostly as black boxes. This naturally leads to questions about trust, failure modes, and whether (in the case of physics models) they can truly internalise physics. In contrast, interpretability work in language models has revealed that they develop internal features that mirror highly abstract human concepts, and moreover that model behavior can be modified by directly editing these internal features using activation steering. It was unknown, however, whether similarly interpretable internal features might exist in scientific models trained only on numerical fields.

Polymathic AI's new "Physics Steering" paper tackles this gap using Walrus[LINK], a 1.3B-parameter transformer trained on The Well, a 15 TB collection of 2D and 3D PDE simulations. The core question is simple but profound: when making predictions does Walrus "think" using concepts which correspond to physical notions as a human would understand them, like "more vortices" or "faster dynamics", and can those "thoughts" be manipulated to change the model's predictions.

---

## How physics steering works
<br/>
<p align="center">
  <img src="/images/blog/walrus_steering/paper-schematic.png" alt="Physics Steering Methodology" width="70%" style="mix-blend-mode: darken;">
</p>


The Physics Steering methodology adapts a single-direction activation steering technique from LLMs to a spatiotemporal transformer: we select two sets of simulations that differ cleanly in one physical attribute (for example, laminar shear flow versus vortex shear flow), then for each simulation record Walrus's activations at a particular layer $l$, and then average them to create two average activations vectors, one for each regime. Finally we find the delta between (i.e. subtract) the averaged activations to yield a single "concept direction" tensor which, if done correctly, will represent the physical attribute in question.

At inference time the concept direction is multiplied by a coefficient, [alpha], and added to Walrus's activations at the same layer $l$ during each step of an autoregressive rollout. Increasing or decreasing [alpha] therefore controls how strongly the concept is injected or suppressed during rollout. Because this is carried out using a pretrained Walrus checkpoint, the methodology tests whether pre-existing internal features encode concepts in a roughly linear fashion.

---

## What the experiments show
<br/>

### Controlling Vorticity
<br/>
<p align="center">
  <img src="/images/blog/walrus_steering/shear-flow-vort-decrease-T.png" alt="Vorticity suppression across steering strengths" width="95%" style="mix-blend-mode: darken;">
</p>

Within a shear-flow dataset, subtracting the learned vorticity direction from activations progressively removes vortices from a turbulent run. As the steering coefficient α becomes more negative, the turbulent flow smooths into a laminar-like profile, with vortices systematically suppressed. The effect is smooth and controllable: stronger negative steering produces progressively cleaner laminar flows.

### Multiple Concepts in Shear Flow
<br/>
<p align="center">
  <img src="/images/blog/walrus_steering/shear-flow-grid-T.png" alt="Vorticity, diffusion, and speed steering in shear flow" width="80%" style="mix-blend-mode: darken;">
</p>

Beyond vorticity, we can extract and manipulate multiple independent concepts. In shear flow experiments, we successfully identify directions for **vorticity** (creating or removing rotational structures), **diffusion** (sharpening or blurring fluid interfaces), and **temporal speed** (making vortices appear earlier or later without changing the simulation time step). Each concept can be independently controlled, demonstrating that Walrus maintains distinct, linearly separable representations for different physical phenomena.

### Fine-Grained Diffusion Control
<br/>
<p align="center">
  <img src="/images/blog/walrus_steering/diffusion-full-grid-T.png" alt="Diffusion steering across multiple physical fields" width="90%" style="mix-blend-mode: darken;">
</p>

The diffusion direction affects multiple related physical fields in a coherent way. Increasing diffusion steering blurs sharp features in tracer concentration, smooths pressure structures, and dampens velocity gradients, while decreasing it sharpens interfaces and enhances fine-scale structure. Importantly, the steering acts consistently across all these coupled fields, suggesting the model has learned an abstract notion of "diffusivity" rather than field-specific patterns.

### Cross-Domain Transfer: The Key Result
<br/>
<p align="center">
  <img src="/images/blog/walrus_steering/cross-domain-transfer-T.png" alt="Cross-domain transfer to Euler shocks and Gray-Scott reaction-diffusion" width="95%" style="mix-blend-mode: darken;">
</p>

The most striking tests apply concept directions learned from shear flow to completely different physical systems:

- **Euler quadrant shocks**: Vorticity steering modulates rotational structure near shock fronts, while speed steering accelerates or decelerates shock propagation—despite these being inviscid compressible flows with completely different governing equations from the incompressible shear flows used to extract the directions.

- **Gray–Scott reaction–diffusion**: Positive vorticity steering transforms stable glider patterns into spiral-like structures reminiscent of the "spral" Gray–Scott parameter regime, demonstrating that the "rotation" concept transfers even to systems with no traditional fluid mechanics.

These cross-domain results provide empirical support for the Linear Representation Hypothesis in a scientific foundation model and suggest that Walrus has learned domain-general notions such as "rotation" or "faster evolution" that transcend any single PDE.

---

## Why it matters
<br/>
These experiments show that internal features in a physics foundation model can be both interpretable and causally manipulable, moving scientific simulators closer to the kind of conceptual control that representation engineering has enabled in language models. Practically, this opens up new possibilities: nudging a simulation into or out of different regimes to explore counterfactual scenarios, adjusting diffusion to emulate different material properties, or stress-testing a model's understanding by asking whether steering behaves in physically sensible ways across variables and domains.

At the same time, further work is needed to address limitations: the physical validity of "creating" phenomena that should not occur under the governing equations remains an open question that demands further investigation. Still, by demonstrating clean, single-direction control over concepts like vorticity, diffusion, and speed across multiple systems, Physics Steering provides some of the first concrete evidence that large cross-domain physics models like Walrus really do learn abstract, reusable representations of underlying physical principles.

---

### Open Source Resources  
<br/>
Code and materials will be made available:
* **Paper:** [Physics Steering: Causal Control of Cross-Domain Concepts in a Physics Foundation Model](https://arxiv.org/abs/2511.20798)
* **Code:** [GitHub Repository](https://github.com/DJ-Fear/walrus_steering)
* **Walrus Model:** [Hugging Face](https://huggingface.co/polymathic-ai/walrus)
* **The Well Dataset:** [GitHub](https://github.com/PolymathicAI/the_well)

*-- Rio Alexa Fear, Payel Mukhopadhyay, Michael McCabe*

---
**Acknowledgements**

We thank Schmidt Sciences and the Simons Foundation for their support. We are grateful to Shirley Ho, Francois Lanusse, and the rest of the PolymathicAI team for valuable discussions and feedback. We also thank Neel Nanda, Rich Turner, and Max Welling for valuable discussions.
