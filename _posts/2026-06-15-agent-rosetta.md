---
layout: post
title: "Protein Design with Agent Rosetta: A Case Study for Specialized Scientific Agents"
authors: Jacopo Teneggi, SM Bargeen Alam Turzo, Tanya Marwah, Alberto Bietti, P. Douglas Renfrew, Vikram Khipple Mulligan, Siavash Golkar
shorttitle: "Protein Design with Agent Rosetta"
date: 2026-06-15 12:00
smallimage: agent-rosetta/splash.jpg
image: agent-rosetta/splash.jpg
blurb: An LLM agent to execute protein-design tasks with RosettaScripts.
shortblurb: An LLM agent to execute protein-design tasks with RosettaScripts.
splashimage: /images/blog/agent-rosetta/splash.jpg
link: https://arxiv.org/pdf/2603.15952
github_link: https://github.com/PolymathicAI/agent-rosetta
permalink: /blog/agent-rosetta/
---

When the *reasoning* power of large language models (LLMs) is combined with AI agents that can write, debug, and execute code through iterative feedback, new opportunities emerge for addressing scientific problems beyond the reach of current machine learning (ML) models. 

Many existing AI agents for science focus on high-level tasks such as literature review, hypothesis generation, or experimental planning. But can AI agents directly operate specialized scientific software and participate in real scientific workflows?

*Protein design provides an ideal test case.*

---

## **Why Protein Design Is a Challenging Task**
<br>
Protein design and more generally, heteropolymer design play important roles in drug development, enzyme engineering, and nanomaterials.

Recent machine learning models such as [AlphaFold](https://deepmind.google/blog/putting-the-power-of-alphafold-into-the-worlds-hands/), [ESMFold](https://biohub.ai/esm/protein/), [RFdiffusion](https://www.bakerlab.org/2023/07/11/diffusion-model-for-protein-design/), and [ProteinMPNN](https://www.bakerlab.org/2022/09/16/proteinmpnn-excels-at-creating-new-proteins/) have made strides in the field. However, these approaches are typically specialized for narrow tasks and are largely restricted to the twenty canonical amino acids found in nature.

Still, one of the most versatile platforms for protein design remains [Rosetta](https://rosettacommons.org/), a widely used physics-based software suite for protein and heteropolymer design, capable of modeling molecular systems beyond the scope of modern machine learning models.

The challenge is that while Rosetta is powerful, it can be difficult to use.

---

## **Introducing Agent Rosetta**
<br>
To bridge this gap, we developed Agent Rosetta, a large language model agent paired with a structured environment for interacting with Rosetta. Agent Rosetta iteratively refines designs to achieve user-defined objectives, combining LLM reasoning with Rosetta’s generality.

<p align="center">
  <img src="/images/blog/agent-rosetta/overview.jpg" width="45%" /><br>
  <em style="color:gray">Figure 1: Schematics of Agent Rosetta’s multi-turn interaction protocol.</em>
</p>

Rather than generating complete Rosetta protocols from scratch, Agent Rosetta operates through an iterative loop (Figure 1):

- Observe the current design state
- Reason about possible improvements
- Select an action
- Execute the action through Rosetta
- Analyze the results
- Repeat

This allows the agent to progressively refine designs while leveraging Rosetta’s underlying physics-based capabilities.

---

## **Why Environment Design Matters**
<br>
One of the things we found most interesting while creating Agent Rosetta is that model intelligence alone is not sufficient. Although frontier language models have encountered Rosetta documentation during training, they frequently struggle to generate valid Rosetta protocols when relying on prompting alone. In many cases, the problem was not scientific reasoning but software interaction: the model understood what it needed to accomplish but failed to express that goal in Rosetta’s specialized scripting language. We found that many of these failures stemmed not from incorrect scientific reasoning, but from difficulties of interacting with complex scientific software, an area that even scientists can find non-intuitive.

To solve this problem, we built a structured environment that abstracts Rosetta’s complexity into higher-level actions and provides targeted feedback, transforming Rosetta from a difficult scripting language into a system that the agent could reliably use. Figure 2 compares the performance of various LLMs at generating valid RosettaScripts syntax with and without our simplified syntax.

<p align="center">
  <img src="/images/blog/agent-rosetta/aacomp-syntax.jpg" width="45%" /><br>
  <em style="color:gray">Figure 2: Comparison of various LLMs at generating compositional constraint blocks (<a href="https://docs.rosettacommons.org/docs/latest/rosetta_basics/scoring/AACompositionEnergy">docs</a>) with and without our simplified syntax.</em>
</p>

Agent Rosetta demonstrates that LLMs can perform competitive scientific design work when paired with a carefully engineered environment that converts complex scientific software into a sequence of interpretable observations, actions, and feedback loops, suggesting that environment design may be just as important as model intelligence for many scientific-agent applications. 

This result highlights an important lesson for scientific AI: **performance often depends as much on environment design as on model capability.**

---

## **Matching Specialized Deep Learning Models**
<br>
We evaluated Agent Rosetta on fixed-backbone protein sequence design using the 20 canonical amino acids. Despite relying on a general-purpose reasoning model rather than a specialized protein design architecture, Agent Rosetta achieved performance comparable to state-of-the-art approaches such as ProteinMPNN and [BoltzGen](https://github.com/HannesStark/boltzgen). Furthermore, Agent Rosetta outperformed a static RosettaScripts protocol written by scientists (Figure 3).

<p align="center">
  <img src="/images/blog/agent-rosetta/fixed-backbone-sequence-design-performance.jpg" width="80%" /><br>
  <em style="color:gray">Figure 3: Comparison of Agent Rosetta with ProteinMPNN, BoltzGen, and a human-written RosettaScripts protocol on fixed-backbone protein sequence design using the 20 canonical amino acids only. RMSD to the target backbone conformation and pLDDT were computed with ESMFold.</em>
</p>

These results suggest that scientific agents can effectively leverage existing simulation tools rather than learning every task directly from data (Figure 4 includes example designs).

<p align="center">
  <img src="/images/blog/agent-rosetta/fixed-backbone-sequence-design-grid.jpg" width="80%" /><br>
  <em style="color:gray">Figure 4: Example designs by all methods on two target backbone conformations.</em>
</p>

---

## **Going Beyond Current Machine Learning Models**
<br>
Perhaps the most compelling result involves non-canonical amino acids. Many real-world protein design applications require synthetic or modified residues that are rare or entirely absent from nature. Because modern machine learning models depend on training data, these molecules are difficult to model when little or no biological data exists.

Rosetta’s physics-based framework does not have this limitation. By combining Rosetta with an LLM agent, we demonstrated a successful design workflow involving non-canonical residues, enabling tasks that current deep learning approaches cannot reliably perform. In particular, we studied the inclusion of a non-canonical amino acid in the core of an existing protein. We considered [N1-formyl-tryptophan (TRF)](https://www.rcsb.org/ligand/TRF), a post-translational modification of tryptophan compatible with AlphaFold 3 for validation. The challenge in this task is to position the residue such that the protein remains stable. No off-the-shelf machine learning model can perform this task, so we compared with a human-written RosettaScripts protocol (see Figure 5).

<p align="center">
  <img src="/images/blog/agent-rosetta/pack-ncaa-performance.jpg" width="80%" /><br>
  <em style="color:gray">Figure 5: Comparison of Agent Rosetta with a human-written protocol on a design task with non-canonical amino acids. RMSD to the native conformation and pLDDT were computed with AlphaFold 3.</em>
</p>

This highlights a key advantage of combining reasoning agents with scientific software: **the ability to operate in domains where data is scarce but physical principles remain available.** 

We validated the structural stability of Agent Rosetta's designs with molecular dynamics (MD) simulations of length 1μs. MD simulations are computational proxies for the stability of a protein conformation over time, and an unfavorable placement of TRF would likely compromise the structure. Figure 6 includes the best designs in terms of RMSD to the native structure at the end of the MD simulation on three backbones.

<p align="center">
  <img src="/images/blog/agent-rosetta/pack-ncaa-grid.jpg" width="80%" /><br>
  <em style="color:gray">Figure 6: Example designs by Agent Rosetta on including one TRF in an existing protein. TRF is colored in purple, and RMSD to the native structure is computed at the end of the MD simulation of 1μs.</em>
</p>

The following animation depicts a portion of the MD simulation for the best design on 7SQ3. TRF, the glowing residue, remains well-packed in the core of the protein without compromising the global structure.

<p align="center" style="margin: 1.5rem 0;">
  <video style="width: 90%; max-width: 800px;" controls preload="metadata" poster="/images/blog/agent-rosetta/md.png">
    <source src="/images/blog/agent-rosetta/md.mp4" type="video/mp4">
  </video>
</p>

---

## **Looking Forward**
<br>
Agent Rosetta represents more than a protein design system. It suggests a future in which AI systems do not merely generate scientific ideas, but actively participate in scientific workflows by interacting with the same software tools used by human researchers. As scientific software continues to evolve, building the environments that connect these tools to intelligent agents may become just as important as building the models themselves.

---

## **Open Source Availability**
<br>
We are actively preparing Agent Rosetta for release to the general public. We will also release all traces and designs generated in our experiments. Upon release, sesources will be available on the [Polymathic AI GitHub](https://github.com/PolymathicAI/agent-rosetta).

*-- Sophie Barstein, Jacopo Teneggi, and Siavash Golkar --*

---

**Acknowledgements**

We would like to acknowledge the support of the Simons Foundation and of Schmidt Sciences. This work was supported in part by the AI2050 program at Schmidt Sciences (Grant G-25-70028). PDR and VKM are wholly funded by the Simons Foundation. We thank the Flatiron Institute's Scientific Computing Core for ongoing support. The computations reported in this paper were performed in-part using resources made available by the Flatiron Institute. The Flatiron Institute is a division of the Simons Foundation. We thank Lucy Reading-Ikkanda and Aditya Chhatrala for their contribution to the figures presented in this paper.

Photo by <a href="https://unsplash.com/@sunify?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alexander Lunyov</a> on <a href="https://unsplash.com/photos/swirling-abstract-pattern-of-green-foliage-and-blue-sky-Qx6dv2tcceU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      